using Plugin.SecureStorage;
using StopIt.Models;
using StopIt.Services;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace StopIt.Pages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class HomePage : ContentPage
    {
        public ObservableCollection<MyAccountPetitions> PetitionsCollection;
        public ObservableCollection<MySignedPetition> SignedPetitionsCollection;
        bool hasSignedPetition;
        public HomePage()
        {
            InitializeComponent();
            PetitionsCollection = new ObservableCollection<MyAccountPetitions>();
            SignedPetitionsCollection = new ObservableCollection<MySignedPetition>(); 
            LblUserName.Text = CrossSecureStorage.Current.GetValue("username");
            GetMyPetitions();
            GetSignedPetitions();
        }

        private async void GetSignedPetitions()
        {
           var signed = await APIService.MySignedPetitions();
            foreach (var sign in signed) {
                SignedPetitionsCollection.Add(sign);
            }
            mySignedPetitionsView.ItemsSource = SignedPetitionsCollection;
        }

        private async void GetMyPetitions()
        {
            var petitions = await APIService.GetMyPetitions();
            foreach (var petition in petitions) 
            {
                PetitionsCollection.Add(petition);
            }
            myPetitionView.ItemsSource = PetitionsCollection;
        }

        private async void ImgMenu_Tapped(object sender, EventArgs e)
        {
            GridOverlay.IsVisible = true;
            await SlMenu.TranslateTo(0, 0, 400, Easing.SpringIn);
        }

        private async void TapCloseMenu_Tapped(object sender, EventArgs e)
        {
            await SlMenu.TranslateTo(-250, 0, 400, Easing.SpringOut);
            GridOverlay.IsVisible = false;
        }

        private void userPetitions_Tapped(object sender, EventArgs e)
        {
            //load page list view of your petitions
        }

        private async void createPetition_Tapped(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new CreatePetitionPage());
        }

        private async void TapLogout_Tapped(object sender, EventArgs e)
        {
            CrossSecureStorage.Current.DeleteKey("username");
            CrossSecureStorage.Current.DeleteKey("loginCount");
            CrossSecureStorage.Current.DeleteKey("userId");
            CrossSecureStorage.Current.DeleteKey("Token");

            await Navigation.PushAsync(new LoginPage());
        }

        private void myPetitionView_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var petitionSelected = e.CurrentSelection.FirstOrDefault() as MyAccountPetitions;
            if (petitionSelected == null) return;
            Navigation.PushModalAsync(new PetitionDetailPage(petitionSelected._id));
        }

        private void mySignedPetitionsView_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var petitionSelected = e.CurrentSelection.FirstOrDefault() as MySignedPetition;
            if (petitionSelected == null) return;
            Navigation.PushModalAsync(new PetitionDetailPage(petitionSelected._id));
        }
    }
}