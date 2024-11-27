"use client";

const BillCard = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">My Bills</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span>Phone Bill</span>
          <span className="text-green-500 font-semibold">Bill Paid</span>
        </li>
        <li className="flex justify-between">
          <span>Internet Bill</span>
          <span className="text-red-500 font-semibold">Not Paid</span>
        </li>
      </ul>
    </div>
  );
};

export default BillCard;
