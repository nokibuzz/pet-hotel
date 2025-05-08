SET search_path = "\$user", public, extensions;
CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE "Listing" DROP COLUMN "location", 
ADD COLUMN "location" geography(Point, 4326);

CREATE INDEX place_location_idx ON "Listing" USING GIST ("location");