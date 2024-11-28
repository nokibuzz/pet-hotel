"use client";

const AccountCard = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">My xPay Accounts</h3>
      <ul className="space-y-2">
        <li className="flex justify-between">
          <span>Active Account</span>
          <button className="bg-red-500 text-white px-4 py-1 rounded-lg">
            Block Account
          </button>
        </li>
        <li className="flex justify-between">
          <span>Blocked Account</span>
          <button className="bg-green-500 text-white px-4 py-1 rounded-lg">
            Unlock Account
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AccountCard;
