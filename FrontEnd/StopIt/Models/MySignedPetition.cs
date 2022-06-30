using System;
using System.Collections.Generic;
using System.Text;

namespace StopIt.Models
{
    public class MySignedPetition
    {
        public DateTime dateCreated { get; set; }
        public List<string> signatures { get; set; }
        public string _id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string category { get; set; }
        public string account { get; set; }
        public int __v { get; set; }
    }
}
