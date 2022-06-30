using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Xamarin.Forms;

namespace StopIt.Models
{
	public class Base64FileJsonConverter : JsonConverter
	{
		public override bool CanConvert(Type objectType)
		{
			return objectType == typeof(string);
		}


		public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
		{
			return Convert.FromBase64String(reader.Value as string);
		}

		//Because we are never writing out as Base64, we don't need this. 
		public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			throw new NotImplementedException();
		}
	}

	public class CreateUserInfo
    {
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string address { get; set; }
        public string state { get; set; }
        public string zip { get; set; }
        public string phone { get; set; }
	}
}
