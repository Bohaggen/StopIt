using Plugin.SecureStorage;
using StopIt.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace StopIt.Pages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class PetitionDetailPage : ContentPage
    {
        public PetitionDetailPage(string petitionId)
        {
            InitializeComponent();
            GetPetitionsDetails(petitionId);
        }

        private async void GetPetitionsDetails(string petitionId)
        {
            int sigCount;
            var petition = await APIService.GetOnePetition(petitionId);
            titlePet.Text = petition.petition.title;
            petOwner.Text = petition.petition.account.username;
            sigCount = petition.petition.signatures.Count;
            signatureCount.Text = sigCount.ToString();
            descriptionPet.Text = petition.petition.description;
            CrossSecureStorage.Current.SetValue("petitionID", petitionId);
        }

        private async void signPetition_Clicked(object sender, EventArgs e)
        {
            string petitionID = CrossSecureStorage.Current.GetValue("petitionID");
            var response = await APIService.SignPetition(petitionID);

            if (!response)
            {
                await DisplayAlert("Error", "Something went wrong! Please Try Again", "Retry");
            }
            else
            {
                var displayReturn = await DisplayAlert("Success", "You Successfully Signed this Petition", "Return Home", "Cancel");

                if (displayReturn)
                {
                    await Navigation.PushAsync(new HomePage());
                }
                else 
                {
                    await Navigation.PushAsync(new HomePage());
                }
            }
        }

        private void messageBoard_Clicked(object sender, EventArgs e)
        {

        }

        private async void TapBack_Tapped(object sender, EventArgs e)
        {
            await Navigation.PopAsync();
        }
    }
}