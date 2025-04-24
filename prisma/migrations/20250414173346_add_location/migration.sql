SET search_path = "\$user", public, extensions, dev;
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA dev;
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA prod;

ALTER TABLE "Listing" DROP COLUMN "location", 
ADD COLUMN "location" geography(Point, 4326);

CREATE INDEX place_location_idx ON "Listing" USING GIST ("location");