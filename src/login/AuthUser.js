import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIURL } from '../constant';
import { Storage } from './Storagesetting';

export default function AuthUser(){
    const navigate = useNavigate();

    const UserIDs = Storage.getItem('userID')
     

    const getToken = () =>{
        const tokenString = Storage.getItem('loginToken');
        const userToken = JSON.parse(tokenString);
        return userToken;
    }

    const getUser = () =>{
        const userString = Storage.getItem('user');
        const user_detail = JSON.parse(userString);
        return user_detail;
    }



    const [token,setToken] = useState(getToken());
    const [user,setUser] = useState(getUser());

    const saveToken = (userType,loginToken, userID, userName, applicantType, name, roleIDs, roleName, bankID, bankName, ipAddress, signImageURL) =>{

        // console.log("roleData",roleData) 
         
        
        if(loginToken !== '' || loginToken != undefined){
            Storage.setItem('userType',JSON.stringify(userType));
        Storage.setItem('loginToken',JSON.stringify(loginToken));
        Storage.setItem('userID',JSON.stringify(userID));
        Storage.setItem('userName',JSON.stringify(userName));
        Storage.setItem('applicantType',JSON.stringify(applicantType));
        Storage.setItem('name',JSON.stringify(name)); 
        Storage.setItem('roleIDs',JSON.stringify(roleIDs)); 
        Storage.setItem('roleName',JSON.stringify(roleName)); 
        Storage.setItem('bankID', JSON.stringify(bankID));
        Storage.setItem('bankName', JSON.stringify(bankName));
        Storage.setItem('ipAddress', JSON.stringify(ipAddress))  
        Storage.setItem('signImageURL', signImageURL)       

  //       const roleIDs = roleData.map(item => item.roleID);
  // const roleNames = roleData.map(item => item.roleName);

  // Storage.setItem('roleIDs',(roleIDs))
  // Storage.setItem('roleName',JSON.stringify(roleNames))
        
        }
        

        setToken(loginToken);
        setUser(userType);
        if(roleIDs != 1){
          navigate('/AllDashboard');
        }else{
          // navigate('/');
          navigate('/PendingUser')
        }
        
    }

    const logout = async () => {
  
        try {
            const response = await axios.post(APIURL + 'User/UserLogout', {
              UserID: UserIDs.replace(/"/g, '')
            });  
            if (response.data.responseCode === '200') {
              localStorage.clear();
              sessionStorage.clear();
              navigate('/login');
            } else {
              console.error("Logout failed:", response.data.responseMessage);
            }
          } catch (err) {
            console.error("Logout error:", err);
          }

        
    }

    const http = axios.create({
        baseURL:APIURL,
        headers:{
            "Content-type" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });

     

    return {
        setToken:saveToken,
        token,
        user,
        getToken,
        http,
        logout
    }
}

