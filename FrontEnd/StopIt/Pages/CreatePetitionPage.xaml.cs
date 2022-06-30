using StopIt.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace StopIt.Pages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class CreatePetitionPage : ContentPage
    {
        public CreatePetitionPage()
        {
            InitializeComponent();
            ReadCategoryFile();
        }

        void ReadCategoryFile()
        {
            var categoryList = new List<string>();
            string categoryLine;

            var assembly = typeof(App).GetTypeInfo().Assembly;

            Stream stream = assembly.GetManifestResourceStream("StopIt.Categories.txt");

            var stateReader = new StreamReader(stream);

            while ((categoryLine = stateReader.ReadLine()) != null)
            {
                categoryList.Add(categoryLine);
            }

            var pickerCategory = category;

            pickerCategory.ItemsSource = categoryList;
        }

        private async void submitPet_Pressed(object sender, EventArgs e)
        {
            string petTitle = title.Text;
            string petDescription = description.Text;
            string petGovType = gov.SelectedItem.ToString();
            string petCategory = category.SelectedItem.ToString();

            var petStatus = await APIService.CreatePetition(petTitle,petDescription,petGovType,petCategory);

            if (!petStatus)
            {
                await DisplayAlert("Error!", "Looks like we can't create your petition at this time. Please try again", " Retry");
            }
            else 
            {
                var res = await DisplayActionSheet("Nice! You created your Petition, Where would like to go now", "", "", "My Petitions", "My Home", "Signed Petitions");

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