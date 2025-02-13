using gradeManager;
using gradeManager.Service.google;
using gradeManager.Service.inscription;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
// Configurer HttpClient
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("https://localhost:7066/api/") });
builder.Services.AddScoped<IUE,UEService>();

builder.Services.AddSingleton(new TranslationService(new HttpClient(), "AIzaSyC9DIX6y7KrVL2EEiCs6AVk9vzKPKbR86s"));
builder.Services.AddScoped<LocalStorageService>();

await builder.Build().RunAsync();
