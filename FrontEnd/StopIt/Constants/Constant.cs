using System;
using System.Collections.Generic;
using System.Text;

namespace StopIt.Constants
{
    public static class Constant
    {
        static string apiMain = "http://10.0.2.2:5000/api/v1/stopit/";

        public static string registerURL = apiMain + "account/add";
        public static string createUserInfoURL = apiMain + "account/add/userinfo/";
        public static string loginURL = apiMain + "account/login";
        public static string verifyURL = apiMain + "account/verify/";
        public static string getMyAccountURL = apiMain + "account/";
        public static string resetPassswordURL = "";
        public static string updateAccountURL = "";

        public static string createPetitionURL = apiMain + "petition/add/";
        
        public static string getMyPetitionsURL = apiMain + "petition/";
        public static string getOnePetitionURL = apiMain + "petition/one/";
    }
}
