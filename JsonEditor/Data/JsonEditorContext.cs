using Microsoft.EntityFrameworkCore;

namespace JsonEditor.Data
{
    public class JsonEditorContext : DbContext
    {
        public JsonEditorContext(DbContextOptions<JsonEditorContext> options) : base(options)
        {
        }
        public DbSet<JsonEditor.Model.JsonModel> all_jsons { get; set; } = default!;
    }
}
