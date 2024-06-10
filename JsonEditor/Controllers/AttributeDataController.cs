using JsonEditor.Data;
using JsonEditor.Model;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Components.Forms;
using System.ComponentModel.DataAnnotations;
using System;

namespace JsonEditor.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AttributeDataController : ControllerBase
    {
        private readonly JsonEditorContext _jsonsContext;
        private List<JsonModel> jsonRecords;

        public AttributeDataController(JsonEditorContext jsonAssets)
        {
            _jsonsContext = jsonAssets;
            jsonRecords = _jsonsContext.all_jsons.ToList();
        }

        [HttpPost("getlist")]
        public IActionResult GetList([FromBody] ListInput input)
        {
            try
            {
                var validationResponse = ValidateInput(input);
                if (validationResponse != null)
                {
                    return validationResponse;
                }
                var queryComponent = BuildWhereClause(input.Data);
                string whereClause = queryComponent.whereClause;
                string requiredAttribute = queryComponent.nextToLastNonNullValue;

                var result = ExecuteSqlQuery(whereClause, requiredAttribute);


                return new ObjectResult(result);
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

        private IActionResult ValidateInput(ListInput input)
        {
            if (input == null || input.Data == null || input.Data.Count == 0)
            {
                return new ObjectResult(new
                {
                    status = 400,
                    error = "JSON string is invalid:",
                    data = new { },
                });
            }

            bool errorFound = false;
            bool nullFound = false;

            foreach (var item in input.Data)
            {
                foreach (var prop in item.GetType().GetProperties())
                {
                    var value = prop.GetValue(item);

                    if (value == null)
                    {
                        nullFound = true;
                    }
                    else if (nullFound)
                    {
                        errorFound = true;
                        break;
                    }
                }

                if (errorFound)
                {
                    return new ObjectResult(new
                    {
                        status = 400,
                        error = "A non-null value follows a null value.",
                        data = new { },
                    });
                }

                nullFound = false;
            }

            return null;
        }

        private (string whereClause, string nextToLastNonNullValue) BuildWhereClause(List<ListData> data)
        {
            List<string> conditions = new List<string>();
            string nextToLastNonNullValue = null;

            foreach (var item in data)
            {
                var properties = item.GetType().GetProperties();
                for (int i = properties.Length - 1; i >= 0; i--)
                {
                    var value = properties[i].GetValue(item);
                    if (value != null)
                    {
                        if (nextToLastNonNullValue == null)
                        {
                            if (i < properties.Length - 1) 
                            {
                                nextToLastNonNullValue = properties[i + 1].Name;
                            }
                            else
                            {
                                nextToLastNonNullValue = "json";
                            }
                        }
                    }
                }

                foreach (var prop in item.GetType().GetProperties())
                {
                    var value = prop.GetValue(item);
                    if (value != null)
                    {
                        string condition;

                        if (value is string)
                        {
                            condition = $"{prop.Name} == \"{value}\"";
                        }
                        else
                        {
                            condition = $"{prop.Name} == {value}";
                        }
                        conditions.Add(condition);
                    }
                }
            }

            if (conditions.Count == 0)
            {
                return (string.Empty, nextToLastNonNullValue);
            }

            string whereClause = string.Join(" AND ", conditions);
            return (whereClause, nextToLastNonNullValue);
        }

        private dynamic ExecuteSqlQuery(string whereClause, string requireAttribute)
        {
            var data = jsonRecords.AsQueryable().Where(whereClause)
            .GroupBy(model => GetPropertyValue(model, requireAttribute))
                .Select(group => new
                {
                    ColumnValue = group.Key,
                    Ids = group.Select(model => model.id).Distinct().ToList() 
                });
            return new
            {
                status = 200,
                message = $"List of distict {requireAttribute}'s",
                data = data,
            };
        }


        private object GetPropertyValue(JsonModel model, string propertyName)
        {
            var property = typeof(JsonModel).GetProperty(propertyName);
            if (property != null)
            {
                return property.GetValue(model);
            }
            return null;
        }

    }

}