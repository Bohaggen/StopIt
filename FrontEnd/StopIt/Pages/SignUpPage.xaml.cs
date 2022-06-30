using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StopIt.Services;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace StopIt.Pages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class SignUpPage : ContentPage
    {
        public SignUpPage()
        {
            InitializeComponent();
        }

        private async void BtnSignUp_Clicked(object sender, EventArgs e)
        {
            string userName = createUser.Text;
            string email = entEmail.Text;
            string password = entPassword.Text;
            string confirmPassword = entConfirmPassword.Text;

            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) || string.IsNullOrEmpty(confirmPassword))
            {
                await DisplayAlert("Error!", "Must fill out information in order to create an account", "Try Again");
            }
            else 
            {
                var answer = await APIService.RegisterUser(userName, email, password, confirmPassword);

                if (!answer)
                {
                    await DisplayAlert("Error!", "Unfortunately something went wrong, please try again!!!", "Try Again");
                }
                else
                {
                    var res = await DisplayAlert("Congratulations", "Welcome to the most powerful tool in your arsenal now!", "Login Now", "Cancel");
                    if (res)
                    {
                        await Navigation.PopAsync();
                    }
                    else 
                    {
                        await Navigation.PopAsync();
                    }
                }
            }

        }

        private void Login_Clicked(object sender, EventArgs e)
        {
            Navigation.PopAsync();
        }
    }
}