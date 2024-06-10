using JsonEditor.Data;
using JsonEditor.Model;
using Microsoft.AspNetCore.Mvc;

namespace JsonEditor.Controllers
{
    [ApiController]
    public class TreeView : ControllerBase
    {
        private readonly JsonEditorContext _jsonsContext;
        private List<JsonModel> jsonRecords;

        public TreeView(JsonEditorContext jsonAssets)
        {
            _jsonsContext = jsonAssets;
            jsonRecords = _jsonsContext.all_jsons.ToList();
        }

        [HttpGet("treeview")]
        public async Task<IActionResult> Get()
        {
            var result = jsonRecords
                .Where(j => j.asset_type_name != null)  // Filter out records with null asset_type_name
                .GroupBy(j => j.asset_type_name)
                .Select(asset_type_name => new
                {
                    name = asset_type_name.Key,
                    children = asset_type_name
                        .Where(j => j.asset_id != null)  // Filter out records with null asset_id
                        .GroupBy(j => j.asset_id)
                        .Select(asset_id => new
                        {
                            name = asset_id.Key,
                            children = asset_id
                                .Where(j => j.json_type != null)  // Filter out records with null json_type
                                .GroupBy(j => j.json_type)
                                .Select(json_type => new
                                {
                                    name = json_type.Key,
                                    children = json_type
                                        .Select(j => new
                                        {
                                            name = new
                                            {
                                                subsystem = j.subsystem ?? string.Empty,
                                                id = j.id
                                            }
                                        })
                                        .ToList()
                                })
                                .ToList()
                        })
                        .OrderBy(subgroup => subgroup.name)
                        .ToList()
                })
                .OrderBy(subgroup => subgroup.name)
                .ToList();

            return Ok(result);
        }
    }
}
