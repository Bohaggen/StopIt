using Plugin.SecureStorage;
using StopIt.Pages;
using StopIt.Services;
using System;
using System.ComponentModel;
using Xamarin.Forms;

namespace StopIt
{
    // Learn more about making custom code visible in the Xamarin.Forms previewer
    // by visiting https://aka.ms/xamarinforms-previewer
    [DesignTimeVisible(false)]
    public partial class LoginPage : ContentPage
    {
        int loginCount = 0;
        public LoginPage()
        {
            InitializeComponent();
        }

        private async void BtnSignUp_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new SignUpPage());
        }

        private async void BtnLogin_Clicked(object sender, EventArgs e)
        {
            
            bool firstLogin = CrossSecureStorage.Current.HasKey("loginCount");
            string username = entUsername.Text;
            string password = entPassword.Text;

            var answer = await APIService.Login(username, password);

            if (!answer)
            {
                await DisplayAlert("Error!", "Looks Like Your username or password is incorrect! Please Try again,", "Retry");
            }
            else 
            {
                if (!firstLogin)
                {
                    loginCount++;
                    CrossSecureStorage.Current.SetValue("loginCount", loginCount.ToString());
                    var sendToUser = await DisplayAlert("Welcome To StopIt", "We need a little more information from you in order to make this service more streamline for you.", "Continue", "Cancel");

                    if (sendToUser)
                    {
                            await Navigation.PushAsync(new UserInfoPage());
                    }
                    else
                    {
                            await Navigation.PushAsync(new UserInfoPage());
                    }
                }
                else 
                {
                    loginCount++;
                    CrossSecureStorage.Current.SetValue("loginCount", loginCount.ToString());
                    var res = await DisplayActionSheet("Welcome Back To StopIt", "", "", "My Petitions", "My Home", "Signed Petitions");

                    if (res.Equals("My Home"))
                    {
                        await Navigation.PushAsync(new HomePage());
                    }
                    else if (res.Equals("My Petitions")) 
                    {
                        await Navigation.PushAsync(new MyPetitionsPage());
                    }
                }
            }
        }
    }
}
