using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace JsonEditor.Model
{
    [Table("all_jsons")]
    public class JsonModel
    {
        [Key, Required]
        public int id { get; set; }

        [Required]
        public int asset_id { get; set; }

        [Required]
        [StringLength(60)]
        public string asset_type_name { get; set; }

        [Required]
        public int json_type { get; set; }

        [StringLength(60)]
        public string? subsystem { get; set; }

        [Column(TypeName = "json")]
        public string json { get; set; }
        //public int? customer_id { get; set; }
    }
    public class StringModel
    {
        public string input { get; set; }
    }
    public class ListData
    {
        [JsonProperty(Order = 1)]
        //public int customer_id { get; set; }

        //[JsonProperty(Order = 2)]
        public string? asset_type_name { get; set; }

        [JsonProperty(Order = 2)]
        public int? asset_id { get; set; }

        [JsonProperty(Order = 3)]
        public int? json_type { get; set; }

        [JsonProperty(Order = 4)]
        public string? subsystem { get; set; }

    }
    public class ListInput
    {
        public List<ListData> Data { get; set; }
    }
}