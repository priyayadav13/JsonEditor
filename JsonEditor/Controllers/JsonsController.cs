using JsonEditor.Data;
using JsonEditor.Model;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace JsonEditor.Controllers
{
    [ApiController]
    public class JsonsController : ControllerBase
    {
        private readonly JsonEditorContext _jsonsContext;
        private List<JsonModel> jsonRecords;

        public JsonsController(JsonEditorContext jsonAssets)
        {
            _jsonsContext = jsonAssets;
            jsonRecords = _jsonsContext.all_jsons.ToList();

        }

        [HttpGet("getJson")]
        public IActionResult Get()
        {            
            if (jsonRecords.Count == 0)
            {
                return new ObjectResult(new
                {
                    StatusCode = 404,
                    message = "No json records found in the database.",
                });
            }
            return new ObjectResult(new
            {
                status = 200,
                message = "Jsons retrieved successfully.",
                data = jsonRecords,
            });
        }

        [HttpGet("getJsonbyId")]
        public IActionResult Get(int id)
        {
            var jsonData = jsonRecords.FirstOrDefault(record => record.id == id);
            if (jsonData == null)
            {
                return new ObjectResult(new
                {
                    status = 400,
                    error = $"No record found with ID {id}",
                    data = new { },
                });
            }
            return new ObjectResult(new
            {
                status = 200,
                message = $"Record found with ID {id}",
                data = jsonData.json,
            });
        }

        [HttpPost("jsonValidation")]
        public IActionResult validation([FromBody] StringModel stringModel)
        {
            try
            {
                string inputString = stringModel.input;
                var jsonContent =JsonSerializer.Deserialize<JsonDocument>(inputString);

                if (stringModel == null)
                {
                    return new ObjectResult(new
                    {
                        status = 400,
                        error = "Missing required field 'Input' in the request body",
                        data = new { },
                    });
                }

                if (IsValid(inputString))
                {
                    return new ObjectResult(new
                    {
                        status = 200,
                        message = "JSON is successfully validated",
                        data = jsonContent
                    });
                }
                else
                {
                    return new ObjectResult(new
                    {
                        status = 400,
                        error = "JSON string is invalid:",
                        data = new { },
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = 500,
                    error = ex.Message,
                    data = new { },
                });
            }
        }

        [HttpPost("Query/{id}")]
        public IActionResult generateQuery(int id, [FromBody] StringModel stringModel)
        {
            try
            {
                if (stringModel == null)
                {       
                    return new ObjectResult(new
                    {
                        status = 400,
                        error = "Invalid input",
                        data = new { },
                    });
                }

                if (IsValid(stringModel.input))
                {
                    var jsonData = jsonRecords.FirstOrDefault(item => item.id == id);

                    if (jsonData == null)
                    {
                        return new ObjectResult(new
                        {
                            status = 400,
                            error = $"No record found with ID {id}",
                            data = new { },
                        });
                    }

                    string json1 = jsonData.json.ToString();
                    string json2 = stringModel.input.ToString();

                    if (json1.Equals(json2))
                    {
                        return new ObjectResult(new
                        {
                            status = 400,
                            error = $"No changes found for ID {id}. The current JSON data matches the provided JSON data.",
                            data = json1,
                        });
                    }
                    else
                    {
                        return new ObjectResult(new
                        {
                            status = 200,
                            message = "Query generated successfully.",
                            data = $"UPDATE jsons SET json = {stringModel} WHERE id = {id}",
                        });
                    }
                }
                else
                {
                    return new ObjectResult(new
                    {
                        status = 400,
                        error = "Updated JSON string is invalid",
                        data = new { },
                    });
                }               
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = 500,
                    error = ex.Message,
                    data = new { },
                });
            }
        }

        [HttpPut("updateJson")]
        public IActionResult UpdateAndSave([FromBody] JsonModel updateRequest)
        {
            try
            {
                if (updateRequest == null)
                {
                    return new ObjectResult(new
                    {
                        status = 400,
                        error = "Invalid input",
                        data = new { },
                    });
                }

                int id = updateRequest.id;
                string asset_type_name = updateRequest.asset_type_name;
                int asset_id = updateRequest.asset_id;
                int json_type = updateRequest.json_type;
                string subsystem = updateRequest.subsystem;
                //int? customer_id = updateRequest.customer_id;

                var existingJsonData = _jsonsContext.all_jsons
                    .SingleOrDefault(j => j.id == id &&
                j.asset_type_name == asset_type_name &&
                j.asset_id == asset_id &&
                j.json_type == json_type &&
                j.subsystem == subsystem);
                //j.customer_id == customer_id);

                if (existingJsonData != null)
                {

                    string jsonString = updateRequest.json.ToString();

                    if (IsValid(jsonString))
                    {
                        _jsonsContext.SaveChanges();

                        return new ObjectResult(new
                        {
                            status = 200,
                            message = "JSON is successfully updated and saved",
                            data = existingJsonData
                        });
                    }
                    else
                    {
                        return new ObjectResult(new
                        {
                            status = 400,
                            error = "Updated JSON string is invalid",
                            data = new { },
                        });
                    }
                }
                else
                {
                    return new ObjectResult(new
                    {
                        status = 404,
                        error = "JSON data not found",
                        data = new { },
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = 500,
                    error = ex.Message,
                    data = new { },
                });
            }
        }

        [HttpPut("json/{id}")]
        public IActionResult UpdateAndSave(int id, [FromBody] StringModel updatedJson)
        {
            try
            {
                if (updatedJson == null)
                {
                    return BadRequest(new
                    {
                        status = 400,
                        error = "Invalid input",
                        data = new { },
                    });
                }
                var existingJsonData = _jsonsContext.all_jsons.SingleOrDefault(j => j.id == id);

                if (IsValid(updatedJson.input))
                {
                    if (existingJsonData != null)
                    {
                        string json1 = existingJsonData.json.ToString();
                        if (json1.Equals(updatedJson.input))
                        {
                            return new ObjectResult(new
                            {
                                status = 200,
                                message = "Update json before saving.",
                                data = new { },
                            }); 
                        }
                        else
                        {
                            existingJsonData.json = updatedJson.input;
                            _jsonsContext.SaveChanges();
                            return new ObjectResult(new
                            {
                                status = 200,
                                message = "JSON is successfully updated and saved",
                                data = existingJsonData,
                            });
                        }
                    }
                    else
                    {
                        return new ObjectResult(new
                        {
                            status = 404,
                            error = "JSON data not found",
                            data = new { },
                        });
                    }
                }
                else
                {
                    return new ObjectResult(new
                    {
                        status = 404,
                        error = "Invalid Json Format",
                        data = new { },
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = 500,
                    error = ex.Message,
                    data = new { },
                });
            }
        }

        private bool IsValid(String json)
        {
            try
            {
                JsonDocument.Parse(json);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}











