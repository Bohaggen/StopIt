using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace StopIt.Models
{
    public class Account
    {
        public string _id { get; set; }
        public string username { get; set; }
        public string id { get; set; }
    }

    public class Petition
    {
        public DateTime dateCreated { get; set; }
        public List<string> signatures { get; set; }
        public string _id { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public string category { get; set; }
        public Account account { get; set; }
        public int __v { get; set; }
    }

    public class PetitionRoot
    {
        public string status { get; set; }
        public Petition petition { get; set; }
    }
}
