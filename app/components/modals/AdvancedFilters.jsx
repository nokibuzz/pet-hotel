"use client";

import qs from "query-string";
import useAdvancedFiltersModal from "@/app/hooks/useAdvancedFiltersModal";
import Modal from "./Modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import RangeInput from "../inputs/RangeInput";
import { options } from "../navbar/BasicFilters";
import AdvancedFiltersOption from "../AdvancedFiltersOption";
import DescreteSlider from "../inputs/DiscreteSlider";
import { faBone, faShower, faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import Toggle from "../inputs/Toggle";

export const facilityOptions = [
  {
    label: "Food",
    icon: faBone,
  },
  {
    label: "Grooming",
    icon: faShower,
  },
  {
    label: "Veterinarian",
    icon: faUserDoctor,
  },
];

const AdvancedFilters = ({ defaultPriceRange }) => {
    const router = useRouter();
    const params = useSearchParams();
    const advancedFiltersModal = useAdvancedFiltersModal();

    const [priceRange, setPriceRange] = useState([1, 100]);
    const [category, setCategory] = useState("");
    const [nearMe, setNearMe] = useState("");
    const [facility, setFacility] = useState("");
    const [hasCancelation, setHasCancelation] = useState(false);
    const [paymentMethodsCards, setPaymentMethodsCards] = useState(false);
    const [paymentMethodsCash, setPaymentMethodsCash] = useState(false);
    const [review, setReview] = useState("");

    useEffect(() => {
      if (advancedFiltersModal.isOpen) {
          setPriceRange([parseInt(params?.get("minPrice") || defaultPriceRange.min), parseInt(params?.get("maxPrice") || defaultPriceRange.max)]);
          setCategory(params?.get("category") || "");
          setNearMe(params?.get("nearMe") || "");
          setFacility(params?.get("facility") || "");
          setHasCancelation(JSON.parse(params?.get("hasCancelation")) || false);
          setPaymentMethodsCards(JSON.parse(params?.get("paymentMethodsCards")) || false);
          setPaymentMethodsCash(JSON.parse(params?.get("paymentMethodsCash")) || false);
          setReview(params?.get("review") || "");
      }
    }, [advancedFiltersModal.isOpen, params]);

    const changeCategory = (value, isSelected) => {
      if (isSelected) {
        setCategory((previousValue) => {
          if (!previousValue) {
            return value;
          }
      
          return `${previousValue},${value}`;
        });
      }
      else {
        setCategory((previousValue) => {
          const updated = previousValue
            .split(",")
            .filter((item) => item !== value)
            .join(",");

            return updated;
        });
      }
    }

    const changeFacility = (value, isSelected) => {
      if (isSelected) {
        setFacility((previousValue) => {
          if (!previousValue) {
            return value;
          }
      
          return `${previousValue},${value}`;
        });
      }
      else {
        setFacility((previousValue) => {
          const updated = previousValue
            .split(",")
            .filter((item) => item !== value)
            .join(",");

            return updated;
        });
      }
    }

    const onSubmit = useCallback(async () => {
        let currentQuery = {};
    
        if (params) {
          currentQuery = qs.parse(params.toString());
          delete currentQuery.advancedFilters;
        }

        if (parseInt(params?.get("minPrice") || defaultPriceRange.min) != priceRange[0]) {
          currentQuery.minPrice = priceRange[0];
        }

        if (parseInt(params?.get("maxPrice") || defaultPriceRange.max) != priceRange[1]) {
          currentQuery.maxPrice = priceRange[1];
        }

        if (category && category != "") {
          currentQuery.category = category;
        }

        if (nearMe != "") {
          if (nearMe == 0.1) {
            delete currentQuery.nearMe;
          }
          else {
            currentQuery.nearMe = nearMe;
          }
        }

        if (facility && facility != "") {
          currentQuery.facility = facility;
        }

        if(hasCancelation) {
          currentQuery.hasCancelation = hasCancelation;
        } 
        else {
          delete currentQuery.hasCancelation;
        }

        if(paymentMethodsCards) {
          currentQuery.paymentMethodsCards = paymentMethodsCards;
        }
        else {
          delete currentQuery.paymentMethodsCards;
        }

        if(paymentMethodsCash) {
          currentQuery.paymentMethodsCash = paymentMethodsCash;
        }
        else {
          delete currentQuery.paymentMethodsCash;
        }

        if (review != "") {
          if (review == 0.1) {
            delete currentQuery.review;
          }
          else {
            currentQuery.review = review;
          }
        }

        if (Object.keys(currentQuery).length !== 0) {
          currentQuery.advancedFilters = true;
        }

        const url = qs.stringifyUrl(
          {
            url: "/",
            query: currentQuery,
          },
          { skipNull: true }
        );
    
        advancedFiltersModal.onClose();
    
        router.push(url);
      }, [
        advancedFiltersModal,
        router,
        params,
        priceRange,
        category,
        nearMe,
        facility,
        hasCancelation,
        paymentMethodsCards,
        paymentMethodsCash,
        review,
    ]);

    const onReset = useCallback(async () => {
      advancedFiltersModal.onClose();
      router.push("/")
    });

    let bodyContent = (
        <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto p-6">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Price (per night)</h3>
            <RangeInput 
              min={defaultPriceRange.min} 
              max={defaultPriceRange.max}
              value={priceRange}
              onChange={setPriceRange}
              rangeElementLabel={'$'} 
            /> 
          </div>
      
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Accommodation Type</h3>
            <div className="flex flex-row gap-3 flex-grow justify-around">
              {options.map((item) => (
                <AdvancedFiltersOption
                  key={item.label}
                  label={item.label}
                  selected={category.includes(item.label)}
                  icon={item.icon}
                  onClick={(value, isSelected) => changeCategory(value, isSelected)}
                />
              ))}
            </div>
          </div>
      
          <div className="border-b pb-10">
            <h3 className="font-semibold text-lg mb-2">Distance from me</h3>
            <DescreteSlider 
              values={{
                0.1: 'X',
                1: '1km',
                3: '3km',
                5: '5km',
                10: '10km',
              }}
              value={nearMe}
              onChange={setNearMe}
            />
          </div>
      
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Facilities</h3>
            <div className="flex flex-row gap-3 flex-grow justify-around">
              {facilityOptions.map((item) => (
                <AdvancedFiltersOption
                  key={item.label}
                  label={item.label}
                  selected={facility.includes(item.label)}
                  icon={item.icon}
                  onClick={(value, isSelected) => changeFacility(value, isSelected)}
                />
              ))}
            </div>
          </div>
      
          <div className="border-b pb-10">
            <h3 className="font-semibold text-lg mb-2">Reviews</h3>
            <DescreteSlider 
              values={{
                0.1: 'X',
                1: '1 paw',
                2: '2 paw',
                3: '3 paw',
                4: '4 paw',
                5: '5 paw',
              }}
              value={review}
              onChange={setReview}
            />
          </div>
      
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">House rules</h3>
            <div className="flex flex-row gap-3 flex-grow justify-around">
              <Toggle
                id="hasCancelation"
                label="Has cancelation policy"
                value={hasCancelation}
                onChange={setHasCancelation}
                col={true}
              />
      
              <Toggle
                id="paymentMethodsCards"
                label="Accept cards"
                value={paymentMethodsCards}
                onChange={setPaymentMethodsCards}
                col={true}
              />
      
              <Toggle
                id="paymentMethodsCash"
                label="Accept cash"
                value={paymentMethodsCash}
                onChange={setPaymentMethodsCash}
                col={true}
              />
            </div>
          </div>
        </div>
    );

    return (
        <Modal
          isOpen={advancedFiltersModal.isOpen}
          onClose={advancedFiltersModal.onClose}
          onSubmit={onSubmit}
          title="Advanced Filters"
          actionLabel={'Search'}
          secondaryAction={onReset}
          secondaryActionLabel={'Reset filters'}
          body={bodyContent}
        />
      );
}

export default AdvancedFilters;