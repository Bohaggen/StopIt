using Newtonsoft.Json;
using StopIt.Models;
using StopIt.Constants;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using Plugin.SecureStorage;
using Xamarin.Forms;
using System.IO;
using System.Net.Http.Headers;
using Xamarin.Essentials;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace StopIt.Services
{
    public static class APIService
    {
        //Post Methods
        public static async Task <bool> RegisterUser(string username, string email, string password, string confirmPassword)
        {
            var register = new Register()
            {
                username = username,
                email = email,
                password = password,
                confirmPassword = confirmPassword,
            };
            var httpClient = new HttpClient();

            var regJson = JsonConvert.SerializeObject(register);

            var myContent = new StringContent(regJson, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(Constant.registerURL, myContent);
                
            if (!response.IsSuccessStatusCode) return false;
            return true;
        }

        public static async Task<bool> Login(string username, string password) 
        {
            var login = new Login()
            {
                username = username,
                password = password
            };
            
            var httpClient = new HttpClient();

            var regJson = JsonConvert.SerializeObject(login);

            var myContent = new StringContent(regJson, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(Constant.loginURL, myContent);

            if (!response.IsSuccessStatusCode) return false;

            var loginResult = await response.Content.ReadAsStringAsync();
            var results = JsonConvert.DeserializeObject<LoginResponse>(loginResult);

            string myToken = results.Token;
            string myId = results.UserId;

            CrossSecureStorage.Current.SetValue("username", username);
            CrossSecureStorage.Current.SetValue("userId", myId);
            CrossSecureStorage.Current.SetValue("Token", myToken);

            return true;
        }

        public static async Task<bool> Verification (string token)
        {
            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await httpClient.PostAsync(Constant.verifyURL + token, null);

            if (!response.IsSuccessStatusCode) return false;

            return true;
        }

        public static async Task<bool> CreateUserInfo(string firstname, string lastname, string address, 
            string state, string zip, string phone)
        {

            var userInfo = new CreateUserInfo()
            {
                firstname = firstname,
                lastname = lastname,
                address = address,
                state = state,
                zip = zip,
                phone = phone
            };

            string userId = CrossSecureStorage.Current.GetValue("userId");
            string url = Constant.createUserInfoURL + userId;
            string token = CrossSecureStorage.Current.GetValue("Token");

            var httpClient = new HttpClient();

            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            
            var regJson = JsonConvert.SerializeObject(userInfo);

            var myContent = new StringContent(regJson, Encoding.UTF8, "application/json");
           
            var response = await httpClient.PostAsync(url, myContent);

            if (!response.IsSuccessStatusCode) return false;

            return true;
        }

        public static async Task<bool> SignPetition(string petitionID)
        {
            string userId = CrossSecureStorage.Current.GetValue("userId");
            string url = Constant.getMyPetitionsURL + userId + "/sign/" + petitionID;
            string token = CrossSecureStorage.Current.GetValue("Token");

            var httpClient = new HttpClient();

            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await httpClient.PostAsync(url, null);

            if (!response.IsSuccessStatusCode) return false;

            return true;
        }
        public static async Task<bool> CreatePetition(string title, string description, string govType, string category)
        {
            //grabs secure stored items for my requests
            var userId = CrossSecureStorage.Current.GetValue("userId");
            var oauthToken = CrossSecureStorage.Current.GetValue("Token");

            var petitionCreate = new CreatePetition()
            {
                title = title,
                description = description,
                govType = govType,
                category = category,
            };

            var httpClient = new HttpClient();

            //This is the token saved from user logged in. This gets checked everytime the open or resume app to make sure that they are logged.
            // Users only stay logged in for 30 days.
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauthToken);

            var regJson = JsonConvert.SerializeObject(petitionCreate);

            var myContent = new StringContent(regJson, Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(Constant.createPetitionURL + userId, myContent);

            if (!response.IsSuccessStatusCode) return false;

            return true;
        }
        //Get Methods
        public static async Task<List<MyAccountPetitions>> GetMyPetitions()
        {
            var httpClient = new HttpClient();

            //grabs secure stored items for my requests
            var userId = CrossSecureStorage.Current.GetValue("userId");
            var oauthToken = CrossSecureStorage.Current.GetValue("Token");

            //This is the token saved from user logged in. This gets checked everytime the open or resume app to make sure that they are logged.
            // Users only stay logged in for 30 days.
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauthToken);

            HttpResponseMessage response = await httpClient.GetAsync(Constant.getMyPetitionsURL + userId);
            //getting info for the request
            var responseBody = await response.Content.ReadAsStringAsync();
            var petBody = JObject.Parse(responseBody);
            JArray petitions = (JArray)petBody["myAccountPetitions"];
            //get the data from the get request
            var myPetitions = petitions.ToObject<List<MyAccountPetitions>>();

            return myPetitions;
        }
        public static async Task<List<MySignedPetition>> MySignedPetitions()
        {
            var httpClient = new HttpClient();
            //grabs secure stored items for my requests
            var userId = CrossSecureStorage.Current.GetValue("userId");
            var oauthToken = CrossSecureStorage.Current.GetValue("Token");
            //This is the token saved from user logged in. This gets checked everytime the open or resume app to make sure that they are logged.
            // Users only stay logged in for 30 days.
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauthToken);
            HttpResponseMessage response = await httpClient.GetAsync(Constant.getMyPetitionsURL + "/signed/" + userId);
            //getting info for the request
            var responseBody = await response.Content.ReadAsStringAsync();
            var petBody = JObject.Parse(responseBody);
            JArray petitions = (JArray)petBody["mySignedPetitions"];
            //get the data from the get request
            var myPetitions = petitions.ToObject<List<MySignedPetition>>();
            return myPetitions;
        }
        //Get Specific Petition and Pass it Back
        public static async Task<PetitionRoot> GetOnePetition(string petid)
        {
            var httpClient = new HttpClient();

            //grabs secure stored items for my requests
            var oauthToken = CrossSecureStorage.Current.GetValue("Token");

            //This is the token saved from user logged in. This gets checked everytime the open or resume app to make sure that they are logged.
            // Users only stay logged in for 30 days.
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", oauthToken);

            var response = await httpClient.GetStringAsync(Constant.getOnePetitionURL + petid);
            //getting info for the request
            return JsonConvert.DeserializeObject<PetitionRoot>(response);
        }
    }
}
