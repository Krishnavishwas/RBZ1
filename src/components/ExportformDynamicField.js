import axios from "axios";
import React, { useEffect, useState } from "react";
import { APIURL } from "../constant";
import { Storage } from "../login/Storagesetting";

const ExportformDynamicField = () => {
  const RoleID = Storage.getItem("roleIDs");
  const LoginToken = Storage.getItem("loginToken");
  const UserID = Storage.getItem("userID");
  const BankID = Storage.getItem("bankID");
  const [countries, setcountries] = useState([]);
  const [currency, setCurrecny] = useState([]);
  const [companies, setompanies] = useState([]);
  const [applicantName, setapplicantName] = useState([]);

  const [applicantTypes, setapplicantTypes] = useState([]);

  const [GovernmentAgencies, setGovernmentAgencies] = useState([]);

  const [sectorData, setsectordata] = useState([]);

  const [masterBank, setMasterBank] = useState([]);

  const [Supervisors, setSupervisors] = useState([]);

  const [ImpSupervisors, setImpSupervisors] = useState([]);

  const Getcurrecy = async () => {
    await axios
      .post(APIURL + "Master/GetCurrencyData", {
        RoleID: RoleID,
        LoginToken: LoginToken,
        UserID: UserID,
      })
      .then((res) => {
        setCurrecny(res.data.responseData);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "Master/GetCompanies")
      .then((res) => {
        setompanies(res.data.responseData);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "User/GetIndividualUsers")
      .then((res) => {
        if (res.data.responseCode === "200") {
          setapplicantName(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "Master/GetGovernmentAgencies")
      .then((res) => {
        if (res.data.responseCode === "200") {
          setGovernmentAgencies(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "Master/GetSectorData")
      .then((res) => {
        if (res.data.responseCode === "200") {
          setsectordata(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "Master/GetMasterBank")
      .then((res) => {
        if (res.data.responseCode === "200") {
          setMasterBank(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    try {
      const response = await axios.post(APIURL + "Master/GetApplicantTypes");
      if (response.data.responseCode === "200") {
        setTimeout(() => {
          setapplicantTypes(response.data.responseData);
        }, 1000);
      } else {
        setapplicantTypes("");
      }
    } catch (error) {
      console.log(error);
    }
 
    await axios
      .post(APIURL + "User/GetSupervisors", {
        BankID: BankID,
        UserID: UserID,
        DepartmentID:"2",
        RoleID: RoleID,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setSupervisors(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
          setSupervisors([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

      await axios
      .post(APIURL + "User/GetSupervisors", {
        BankID: BankID,
        UserID: UserID,
        DepartmentID:"3",
        RoleID: RoleID,
      })
      .then((res) => {
        if (res.data.responseCode === "200") {
          setImpSupervisors(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
          setImpSupervisors([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(APIURL + "Admin/GetAllCountry")
      .then((res) => {
        if (res.data.responseCode === "200") {
          setcountries(res.data.responseData);
        } else {
          console.log(res.data.responseMessage);
          setcountries([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    Getcurrecy();
  }, []);

  return {
    currency,
    companies,
    GovernmentAgencies,
    applicantTypes,
    sectorData,
    masterBank,
    Supervisors,
    ImpSupervisors,
    applicantName,
    countries,
  };
};

export default ExportformDynamicField;
