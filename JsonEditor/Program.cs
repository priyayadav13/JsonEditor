using JsonEditor.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Allow4200",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:4200")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddEntityFrameworkNpgsql().AddDbContext<JsonEditorContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DatabaseCredential") ?? throw new InvalidOperationException("Connection string 'JsonEditorContext' not found.")));

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("Allow4200");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
