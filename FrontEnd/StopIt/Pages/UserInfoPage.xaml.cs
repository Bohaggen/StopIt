using SignaturePad.Forms;
using StopIt.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace StopIt.Pages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class UserInfoPage : ContentPage
    {
        public UserInfoPage()
        {
            InitializeComponent();
            ReadStateFile();
        }

        private async void saveInfo_Clicked(object sender, EventArgs e)
        {
            var documentsPath = Environment.GetFolderPath(Environment.SpecialFolder.Personal);
            string sigLocation = "keep";

            string firstname = entFirst.Text;
            string lastname = entLast.Text;
            string address = entaddress.Text;
            string state = statePicker.SelectedItem.ToString();
            string zip = entZip.Text;
            string phone = entPhoneNum.Text;

            Stream signStream = await sigPad.GetImageStreamAsync(SignatureImageFormat.Png);

            if (string.IsNullOrEmpty(firstname) || string.IsNullOrEmpty(firstname) || string.IsNullOrEmpty(firstname) || string.IsNullOrEmpty(firstname) ||
                string.IsNullOrEmpty(firstname) || string.IsNullOrEmpty(firstname) || string.IsNullOrEmpty(signStream.ToString()))
            {
                await DisplayAlert("Error", "Need all areas filled out for your convenience", "Finish Filling Out Form");
            }
            else
            {
                var userInfoPassed = await APIService.CreateUserInfo(firstname, lastname, address, state, zip, phone);

                if (userInfoPassed)
                {
                    await Navigation.PushAsync(new HomePage());
                }
                else
                {
                    await DisplayAlert("Error", "Looks like Something went wrong!", "Please Try Again!");
                }
            }
        }

        void ReadStateFile() 
        {
            var stateList = new List<string>();
            string stateLine;

            var assembly = typeof(App).GetTypeInfo().Assembly;

            Stream stream = assembly.GetManifestResourceStream("StopIt.States.txt");

            var stateReader = new StreamReader(stream);

            while ((stateLine = stateReader.ReadLine()) != null) 
            {
                stateList.Add(stateLine);
            }

            var pickerState = statePicker;

            pickerState.ItemsSource = stateList;
        }
    }
}