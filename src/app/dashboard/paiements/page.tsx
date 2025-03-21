
"use client"

import { motion } from "framer-motion";
import { CreditCard, DollarSign, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import Dashboard from "../page";

export default function PaymentsPage() {
  const payments = [
    {
      id: 1,
      property: "Villa Vue Mer",
      client: "Jean Dupont",
      date: "2024-03-15",
      amount: "1,250€",
      status: "completed",
      method: "Carte bancaire"
    },
    {
      id: 2,
      property: "Appartement Haussmannien",
      client: "Marie Martin",
      date: "2024-03-18",
      amount: "720€",
      status: "pending",
      method: "Virement bancaire"
    },
    {
      id: 3,
      property: "Chalet Montagne",
      client: "Pierre Durand",
      date: "2024-03-25",
      amount: "2,100€",
      status: "failed",
      method: "PayPal"
    }
  ];

  return (
    <Dashboard>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Paiements</h2>
          <Button className="bg-primary text-white">
            Nouveau paiement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Total perçu</p>
                <h3 className="text-2xl font-bold">4,070€</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 text-sm flex items-center">
                +12.5% <span className="ml-1">ce mois</span>
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <h3 className="text-2xl font-bold">720€</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <CreditCard className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500 text-sm flex items-center">
                1 paiement en attente
              </span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Échec</p>
                <h3 className="text-2xl font-bold">2,100€</h3>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-red-500 text-sm flex items-center">
                1 paiement échoué
              </span>
            </div>
          </motion.div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Propriété
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment, index) => (
                  <motion.tr 
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.property}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{payment.client}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                        {payment.method}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${payment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {payment.status === 'completed' 
                          ? 'Complété' 
                          : payment.status === 'pending'
                            ? 'En attente'
                            : 'Échoué'
                        }
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
