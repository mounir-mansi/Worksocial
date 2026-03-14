// CompanyProvider
import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { hostname } from "../HostnameConnect/Hostname";

const CompanyContext = createContext(null);

export function useCompany() {
  return useContext(CompanyContext);
}

export function CompanyProvider({ children }) {
  const [companies, setCompanies] = useState([]);

  const getCompanies = async () => {
    try {
      await fetch(`${hostname}/companies`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      }).then((res) => res.json().then((data) => setCompanies(data)));
      console.info(companies);
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  const value = useMemo(() => ({ companies, getCompanies }), [companies]);
  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}

CompanyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
