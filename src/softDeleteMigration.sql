/* 
    These lines is for handling duplicate unique constraint when the data is soft deleted
*/
-- PIC
-- Add Column
ALTER TABLE `pic` ADD COLUMN `v_phone_uk` INT AS (IF(`deleted_at` IS NULL, 1, NULL));
-- Add Unique
ALTER TABLE `pic` ADD CONSTRAINT UNIQUE (`phone`, `v_phone_uk`);
-- Drop Index
DROP INDEX `pic_phone_key` on `pic`;

-- Customer
-- Add Column
ALTER TABLE `customer` ADD COLUMN `v_name_uk` INT AS (IF(`deleted_at` IS NULL, 1, NULL));
-- Add Unique
ALTER TABLE `customer` ADD CONSTRAINT UNIQUE (`name`, `v_name_uk`);
-- Drop Index
DROP INDEX `customer_name_key` on `customer`;