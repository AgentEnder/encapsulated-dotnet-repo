using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

using Model;
using Services;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly ILogger<WeatherForecastController> _logger;
    private readonly WeatherForecastService _service;

    public WeatherForecastController(ILogger<WeatherForecastController> logger, WeatherForecastService service)
    {
        _logger = logger;
        _service = service;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return _service.GetWeatherForecasts();
    }
}
