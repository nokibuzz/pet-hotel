"use client";

import React from "react";

const AddressInput = ({ value, onChange }) => (
  <div className="mb-4">
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full border rounded-md p-2"
      placeholder="Search for your address..."
    />
  </div>
);

export default AddressInput;
