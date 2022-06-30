using Plugin.SecureStorage;
using StopIt.Pages;
using StopIt.Services;
using System;
using System.Linq.Expressions;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Internals;
using Xamarin.Forms.Xaml;

namespace StopIt
{
    public partial class App : Application
    {
        bool haveToken = CrossSecureStorage.Current.HasKey("Token");
        bool hasLoggedIn = CrossSecureStorage.Current.HasKey("loginCount");
        public App()
        {
            InitializeComponent();
            //this will eventually load another page
            MainPage = new NavigationPage(new LoginPage());
        }

        protected async override void OnStart()
        {
            string token;
            int loginCount = 0;

            if (haveToken && hasLoggedIn)
            {
                token = CrossSecureStorage.Current.GetValue("Token");
                loginCount = Int32.Parse(CrossSecureStorage.Current.GetValue("loginCount"));

                var loginValid = await APIService.Verification(token);

                if (loginValid)
                {
                    var home = new NavigationPage(new HomePage());
                    MainPage = home;
                    loginCount++;
                    CrossSecureStorage.Current.SetValue("loginCount", loginCount.ToString());
                }
                else
                {
                    MainPage = new NavigationPage(new LoginPage());
                }
            }
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }

    }
}
