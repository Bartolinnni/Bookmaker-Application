using System.Net;
using Bukmacher.Database;
using Bukmacher.Server.Models.API;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RestSharp;

namespace Bukmacher.Core.FootballApiClient;

public class FootballApiClient : IFootballApiClient
{
    private readonly DataContext _dataContext;
    private readonly IConfiguration Configuration;
    private readonly string ApiUrl = "https://api-football-v1.p.rapidapi.com";
    private readonly RestClient _client;
    private readonly string ApiToken;
    private readonly JsonSerializerSettings settings;
    public FootballApiClient(DataContext dataContext, IConfiguration configuration)
    {
        _dataContext = dataContext;
        _client = new RestClient(new Uri(ApiUrl));
        Configuration = configuration;
        ApiToken = Configuration["ConnectionStrings:ApiToken"];
        settings = new JsonSerializerSettings
        {
            NullValueHandling = NullValueHandling.Ignore,
            MissingMemberHandling = MissingMemberHandling.Ignore
        };
    }

    public async Task<GameResponse.FixtureResponse> DownloadFutureGames(string leaugeId)
    {
        var request = new RestRequest("/v3/fixtures", Method.Get);
        request.AddParameter("league", leaugeId);
        request.AddParameter("next", 50);
        request.AddHeader("X-RapidAPI-Key", ApiToken);
        request.AddHeader("X-RapidAPI-Host", "api-football-v1.p.rapidapi.com");

        //var response = await _client.ExecuteAsync(request);
        var response = await
            System.IO.File.ReadAllTextAsync(
            "C:\\Users\\barto_azqkiik\\OneDrive\\Pulpit\\response_content_from_to.json");

        if (response == null) // || response.StatusCode != HttpStatusCode.OK)
            return null;

        var fixtures = JsonConvert.DeserializeObject<GameResponse.FixtureResponse>(response, settings);

        return fixtures;
    }

    public async Task<GameResponse.FixtureResponse> DownloadLiveGames(string leaugeId)
    {
        var request = new RestRequest("/v3/fixtures", Method.Get);
        request.AddParameter("league", leaugeId);
        request.AddParameter("live", "all");
        request.AddHeader("X-RapidAPI-Key", ApiToken);
        request.AddHeader("X-RapidAPI-Host", "api-football-v1.p.rapidapi.com");

        //var response = await _client.ExecuteAsync(request);
        var response = await
            System.IO.File.ReadAllTextAsync(
                "C:\\Users\\barto_azqkiik\\OneDrive\\Pulpit\\response_content_from_to.json");

        if (response == null)// || response.StatusCode != HttpStatusCode.OK)
            return null;

        var fixtures = JsonConvert.DeserializeObject<GameResponse.FixtureResponse>(response, settings);

        return fixtures;
    }

    public async Task<GameResponse.FixtureResponse> DownloadSingleGame(string gameId)
    {
        var request = new RestRequest("/v3/fixtures", Method.Get);
        request.AddParameter("game", gameId);
        request.AddHeader("X-RapidAPI-Key", ApiToken);
        request.AddHeader("X-RapidAPI-Host", "api-football-v1.p.rapidapi.com");

        var response = await _client.ExecuteAsync(request);
        //var response =
        //System.IO.File.ReadAllTextAsync(
        //"C:\\Users\\barto_azqkiik\\OneDrive\\Pulpit\\response_content_from_to.json");

        if (response == null)// || response.StatusCode != HttpStatusCode.OK)
            return null;

        var fixtures = JsonConvert.DeserializeObject<GameResponse.FixtureResponse>(response.Content, settings);

        return fixtures;
    }

    public async Task<List<GameResponse.Response>> DownloadGamesByIds(string ids)
    {
        var request = new RestRequest("/v3/fixtures", Method.Get);
        request.AddParameter("ids", ids);
        request.AddHeader("X-RapidAPI-Key", ApiToken);
        request.AddHeader("X-RapidAPI-Host", "api-football-v1.p.rapidapi.com");

        var response = await _client.ExecuteAsync(request);

        if (response.StatusCode != HttpStatusCode.OK)
            return null;

        var fixtures = JsonConvert.DeserializeObject<GameResponse.FixtureResponse>(response.Content, settings);

        return fixtures.response;
    }
}