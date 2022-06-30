using System;
using System.Collections.Generic;
using System.Text;

namespace StopIt.Models
{
    public class MyAccountPetitions
    {
        public DateTime dateCreated { get; set; }
        public List<string> signatures { get; set; }
        public string _id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string category { get; set; }
    }
}
