import React, { Component } from "react";
import LoadingCircle from "@/components/common/LoadingCircle";

const isInitialLoading = false;
const fetchError = false;
const bidz = undefined;
const page = 1;
const paginationData = {};

const bids = [
  {
    bidder: "0x123456789",
    amount: 0.1,
    timestamp: "2021-05-01T00:00:00.000Z",
  },
  {
    bidder: "0x123456788",
    amount: 0.4,
    timestamp: "2021-05-01T00:00:00.000Z",
  },
  {
    bidder: "0x123456782",
    amount: 1.0,
    timestamp: "2021-05-01T00:00:00.000Z",
  },
];

console.log(bids);

export default class BidHistory extends Component {
  render() {
    return (
      <div className="flex flex-col px-4">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            {isInitialLoading ? (
              <div className="py-24">
                <LoadingCircle color="#000000" />
              </div>
            ) : fetchError ? (
              <div className="py-24 text-center">
                <p className="text-lg text-gray-500">
                  Hubo un error al cargar las subastas
                </p>
              </div>
            ) : bids && bids.length > 0 ? (
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Comprador
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Monto
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bids.map((bid) => (
                      <tr key={bid.bidder}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {bid.bidder}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {bid.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {bid.timestamp}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-24 text-center">
                <p className="text-lg text-gray-500">
                  No se encontraron subastas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
