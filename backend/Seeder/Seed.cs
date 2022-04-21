using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Citolab.Persistence;
using Citolab.Examenkompas.Models;
using ExcelDataReader;
using Microsoft.Extensions.Logging;
using System.Data;
using System.IO;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using Citolab.Examenfeedback.Models;

namespace Citolab.Examenkompas.Seeder
{
    public class Seed
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        private bool overrideExistingValues = false;
        private MarkdownSharp.Markdown _markdown = new MarkdownSharp.Markdown();
        public Seed(IUnitOfWork unitOfWork, ILoggerFactory loggerFactory
        )
        {
            _unitOfWork = unitOfWork;
            _logger = loggerFactory.CreateLogger(GetType());
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        }

        public async Task Run()
        {
            await Task.Run(() => CheckUsersPerDayAndExportAllActions());
            //await Task.Run(() => CheckUsersPerDay());
            //Console.WriteLine($"Reading excel: schalen");
            //Console.WriteLine($"_________________________________");
            //var schalen = ReadSchalenExcel();
            //await UpdateNTermInExamensAsync(schalen);
            //await SetScoreKey();
            ////CheckItems();
            //var items = ReadItemsExcel();
            //await AddItemsAsync(items);
            //await AddItemInfoToExamsAsync();
            ////await NewDatabase(schalen);
            //await UpdateWikiwijsLink(schalen);
            Console.WriteLine($"Done seeding.");
            //GetExamenLinks();
        }

        class UserInfo
        {
            public DateTime Date { get; set; }
            public int ActiveUserCount { get; set; }
            public int VisitorCount { get; set; }
        }

        private async Task SetScoreKey()
        {
            var examenScoreRepos = _unitOfWork.GetCollection<Examenscores>();
            var allScores = examenScoreRepos.AsQueryable().ToList();
            foreach (var score in allScores)
            {
                score.Key = $"{score.ExamenId}|{score.CreatedByUserId}";
            }
            var uniqueKeys = allScores.Select(s => s.Key).Distinct().ToList();
            var delCount = 0; 
            foreach(var key in uniqueKeys)
            {
                var scores = allScores.Where(s => s.Key == key).OrderByDescending(s => s.LastModified);
                var i = 0; 
                foreach(var score in scores)
                {
                    if (i != 0)
                    {
                        delCount++;
                        Console.WriteLine($"Deleting score {delCount}");
                         await examenScoreRepos.DeleteAsync(score.Id);
                    }
                    i++;
                }
            }
            allScores = examenScoreRepos.AsQueryable().ToList();
            foreach (var score in allScores)
            {
                score.Key = $"{score.ExamenId}|{score.CreatedByUserId}";
                await examenScoreRepos.UpdateAsync(score);
            }
        }

        private void CheckUsersPerDayAndExportAllActions(bool exportUsers = false, bool exportActions = false)
        {
            var actionRepos = _unitOfWork.GetCollection<UserAction>();
            var allActions = actionRepos.AsQueryable().ToList();

            //var from = DateTime.Parse("01/01/2021");
            //var to = DateTime.Parse("01/01/2022");
            //allActions = allActions.Where(a => a.Created >= from && a.Created < to).ToList();
            var uniqueDays = allActions.Select(a => a.Created.Date).Distinct();
            if (exportActions)
            {
                using (TextWriter writer = new StreamWriter($@"acties_examenkompas.csv"))
                {
                    var cultureInfo = CultureInfo.GetCultureInfo("nl-NL");
                    using (var csv = new CsvWriter(writer,
                        new CsvConfiguration(cultureInfo) { Delimiter = ";", Encoding = Encoding.GetEncoding(0) }))
                    {
                        csv.WriteRecords(allActions);
                    }
                };
            }
            var unique = allActions.GroupBy(a => a.CreatedByUserId)
                .Where(c => c.Count() > 1)
                .Select(c => c.Key)
                .Distinct()
                .ToList();
            var allActionsPerUser = new Dictionary<Guid, List<UserAction>>();
            var allActionsPerUserPerDate = new Dictionary<Guid, HashSet<DateTime>>();
            var activeActionsAll = new List<UserAction>();
            allActions.ForEach(a =>
            {
                if (!allActionsPerUser.ContainsKey(a.CreatedByUserId))
                {
                    allActionsPerUser.Add(a.CreatedByUserId, new List<UserAction>());
                    allActionsPerUserPerDate.Add(a.CreatedByUserId, new HashSet<DateTime>());
                }
                allActionsPerUser[a.CreatedByUserId].Add(a);

               if (!allActionsPerUserPerDate[a.CreatedByUserId].Contains(a.Created.Date)) {
                    allActionsPerUserPerDate[a.CreatedByUserId].Add(a.Created.Date);
                }

                if (a.Action == "EXAMEN_SCORE_CHANGED" || a.Action == "SHOW_REPORT")
                {
                    activeActionsAll.Add(a);
                }
            });

            var uniqueActive = unique.Where(bezoeker =>
            {
                var actions = allActionsPerUser[bezoeker];
                var viewedReport = actions.Any(a => a.Action == "SHOW_REPORT");
                var answersFilled = actions.Count(a => a.Action == "EXAMEN_SCORE_CHANGED");
                return viewedReport && answersFilled >= 10;
            });
            var returningUsers = unique.Where(bezoeker =>
            {
                var actions = allActionsPerUser[bezoeker];
                var dayCount = 0;
                foreach (var day in uniqueDays)
                {
                    if (allActionsPerUserPerDate[bezoeker].Contains(day))
                    {
                        dayCount++;
                    }
                    if (dayCount > 1) return true;
                }
                return false;
            });

            var returningActiveUsers = uniqueActive.Where(bezoeker =>
            {
                var actions = allActionsPerUser[bezoeker];
                var dayCount = 0;
                foreach (var day in uniqueDays)
                {
                    if (allActionsPerUserPerDate[bezoeker].Contains(day))
                    {
                        dayCount++;
                    }
                    if (dayCount > 1) return true;
                }
                return false;
            });
            Console.WriteLine($" Unieke bezoekers: {unique.Count()}");
            Console.WriteLine($" Actieve bezoekers: {uniqueActive.Count()}");
            Console.WriteLine($" Terugkomende bezoekers: {returningUsers.Count()}");
            Console.WriteLine($" Terugkomende actieve bezoekers: {returningActiveUsers.Count()}");

            
            var list = new List<UserInfo>();
            foreach (var day in uniqueDays)
            {
                var actionPerDay = allActions.Where(a => a.Created.Date == day);
                var uniqueBezoekers = actionPerDay.GroupBy(a => a.CreatedByUserId)
                    .Where(c => c.Count() > 1)
                    .Select(c => c.Key)
                    .Distinct();
                Console.WriteLine($"Datum {day}: Unieke bezoekers: {uniqueBezoekers.Count()}");

                var activeActions = actionPerDay.Where(a => a.Action == "EXAMEN_SCORE_CHANGED" || a.Action == "SHOW_REPORT").ToList();

                var activeUsers = uniqueBezoekers.Where(bezoeker =>
                {
                    var viewedReport = activeActions.Any(a => a.CreatedByUserId == bezoeker && a.Action == "SHOW_REPORT");
                    var answersFilled = activeActions.Count(a => a.CreatedByUserId == bezoeker && a.Action == "EXAMEN_SCORE_CHANGED");
                    return viewedReport && answersFilled >= 10;
                });
                list.Add(new UserInfo
                {
                    Date = day,
                    ActiveUserCount = activeUsers.Count(),
                    VisitorCount = uniqueBezoekers.Count()
                });
                Console.WriteLine($"Datum {day}: Active bezoekers: {activeUsers.Count()}");
            }
            {
                using (TextWriter writer = new StreamWriter($@"usage_examenkompas.csv"))
                {
                    var cultureInfo = CultureInfo.GetCultureInfo("nl-NL");
                    using (var csv = new CsvWriter(writer,
                        new CsvConfiguration(cultureInfo) { Delimiter = ";", Encoding = Encoding.GetEncoding(0) }))
                    {
                        csv.WriteRecords(list);
                    }
                };
            }
        }

        private async Task UpdateWikiwijsLink(List<SchaalRij> schalen)
        {
            var examenonderdeelLookup = schalen
                .Where(s => s.ExamenonderdeelType != ExamenonderdeelType.Taxonomie)
                .ToDictionary(s =>
                 $"{s.ExamenId}_{s.ExamenonderdeelType}_{string.Join(',', s.ExamenonderdeelItemVolgnummers)}",
                 s => s);
            var examenAnalysisRepos = _unitOfWork.GetCollection<ExamenAnalysisMetadata>();
            var examenRepos = _unitOfWork.GetCollection<Examen>();

            var existingExamenAnalysis = examenAnalysisRepos.AsQueryable().ToList();
            var existingExamens = examenRepos.AsQueryable().ToList();

            var uniqueExamens = schalen.Select(s => s.ExamenId).Distinct()
                .ToDictionary(code => code, code => schalen.Where(s => s.ExamenId == code).ToList());

            foreach (var examenKeyValuePair in uniqueExamens)
            {
                var examenRow = examenKeyValuePair.Value.FirstOrDefault();
                var rows = examenKeyValuePair.Value;
                var opgaven = rows.Where(r => r.ExamenonderdeelType == ExamenonderdeelType.Examenonderdeel).ToList();

                var matchingExamen = existingExamens.FirstOrDefault(e => e.ExamenId == examenRow.ExamenId);
                var matchingExamenAnalysis = existingExamenAnalysis.FirstOrDefault(e => e.ExamenId == examenRow.ExamenId);

                var changedDomeinen = new List<(string oldName, string newName)>();

                matchingExamenAnalysis.Examenonderdelen = matchingExamenAnalysis.Examenonderdelen.Select(examenonderdeel =>
                {
                    if (examenonderdeel.Type != ExamenonderdeelType.Taxonomie)
                    {
                        var excelonderdeel = examenonderdeelLookup[$"{matchingExamenAnalysis.ExamenId}_{examenonderdeel.Type}_{string.Join(',', examenonderdeel.ItemVolgnummers)}"];
                        if (examenonderdeel.NaamHtml != excelonderdeel.ExamenOnderdeelNaamHtml)
                        {
                            changedDomeinen.Add((examenonderdeel.Naam, excelonderdeel.ExamenonderdeelNaam));
                            examenonderdeel.Naam = excelonderdeel.ExamenonderdeelNaam;
                            examenonderdeel.NaamHtml = excelonderdeel.ExamenOnderdeelNaamHtml;
                        }
                    }
                    return examenonderdeel;
                }).ToList();
                if (changedDomeinen.Any())
                {
                    var domeinen = matchingExamenAnalysis.Examenonderdelen.Where(e =>
                        e.Type == ExamenonderdeelType.Domein ||
                        e.Type == ExamenonderdeelType.Subdomein)
                    .Select(d => d.Naam)
                    .Distinct()
                    .Select(domeinnaam =>
                    {
                        var matching = matchingExamenAnalysis.Examenonderdelen.FirstOrDefault(e =>
                           (e.Type == ExamenonderdeelType.Domein ||
                            e.Type == ExamenonderdeelType.Subdomein) && e.Naam == domeinnaam);
                        return new DomeinInfo
                        {
                            Titel = domeinnaam,
                            TitelHtml = matching.NaamHtml,
                        };
                    })
                    .ToList();
                    matchingExamenAnalysis.Domeinen = domeinen;
                    matchingExamen.Domeinen = domeinen;
                    Console.WriteLine($"Updating assessment {matchingExamenAnalysis.GetExamenNaam()}");
                    await examenAnalysisRepos.UpdateAsync(matchingExamenAnalysis);
                    await examenRepos.UpdateAsync(matchingExamen);
                }
            }
        }


        private async Task NewDatabase(List<SchaalRij> schalen)
        {
            Console.WriteLine($"Adding clusters");
            Console.WriteLine($"_________________________________");
            await AddClustersPerNiveauAsync(schalen);
            Console.WriteLine($"Adding assessments");
            Console.WriteLine($"_________________________________");
            await AddExamensWithoutItemsAsync(schalen);
            Console.WriteLine($"Reading excel: items");
            Console.WriteLine($"_________________________________");
            var items = ReadItemsExcel();
            await AddItemsAsync(items);
        }

        class CsvUrlLinkRow
        {
            public string Opleidingsniveau { get; set; }
            public string Leerweg { get; set; }
            public string Vakcode { get; set; }
            public string Vaknaam { get; set; }
            public string Url { get; set; }
        }

        private void GetExamenLinks()
        {
            var alleExamen = _unitOfWork.GetCollection<Examen>().AsQueryable().ToList();
            var cultureInfo = CultureInfo.GetCultureInfo("nl-NL");
            using (TextWriter writer = new StreamWriter($@"citolab-examenkompas-links.csv"))
            {
                using (var csv = new CsvWriter(writer,
                    new CsvConfiguration(cultureInfo) { Delimiter = ";", Encoding = Encoding.GetEncoding(0) }))
                {
                    var rows = new List<CsvUrlLinkRow>();
                    foreach (var examen in alleExamen)
                    {
                        var row = new CsvUrlLinkRow
                        {
                            Leerweg = examen.Leerweg.HasValue ? examen.Leerweg.GetDescription() : "",
                            Opleidingsniveau = examen.Opleidingsniveau.GetDescription(),
                            Vakcode = examen.Vakcode.ToString(),
                            Vaknaam = examen.Vaknaam,
                            Url = $"https://examenkompas.citolab.nl/vak/{examen.Vakcode}/{examen.Opleidingsniveau.OpleidingsniveauOmschrijving(examen.Leerweg)}"
                        };
                        rows.Add(row);
                    }
                    csv.WriteRecords(rows);
                }
            }
        }

        private async Task AddItemInfoToExamsAsync()
        {
            var items = _unitOfWork.GetCollection<Item>().AsQueryable().ToList();
            var alleExamens = _unitOfWork.GetCollection<ExamenAnalysisMetadata>().AsQueryable().ToList();
            await UpdateItemsInExamensAsync<Examen>(items, alleExamens);
        }


        private async Task UpdateNTermInExamensAsync(List<SchaalRij> schalen)
        {
            var repos = _unitOfWork.GetCollection<ExamenAnalysisMetadata>();
            var examens = repos.AsQueryable().ToList();
            foreach (var examen in examens)
            {
                var schaalrij = schalen.FirstOrDefault(e => e.ExamenId == examen.ExamenId);
                if (examen != null && schaalrij.ExamenNTerm != examen.NTerm)
                {
                    examen.NTerm = schaalrij.ExamenNTerm;
                    await repos.UpdateAsync(examen);
                }
            }
        }
        private void CheckItems()
        {

            // check if items are missing from excel eva.
            var alleExamens = _unitOfWork.GetCollection<Examen>().AsQueryable().ToList();
            var alleItems = _unitOfWork.GetCollection<Item>().AsQueryable().ToList();

            var itemsInExamen = alleExamens.SelectMany(e => e.Opgaven.SelectMany(o => o.Items.Select(i => $"{e.ExamenId}|{i.Volgnummer}")));
            var itemsInExcel = alleItems.Select(i => $"{i.ExamenId}|{i.Volgnummer}").ToHashSet();
            Console.WriteLine("");
            Console.WriteLine("");
            Console.WriteLine($"Checking items in schalen, that are missing in items.xslx");
            Console.WriteLine("");
            var found = false;
            foreach (var item in itemsInExamen)
            {
                if (!itemsInExcel.Contains(item))
                {
                    Console.WriteLine($"Item {item} zit wel in schalen.xlsx maar niet in items.xlsx");
                    found = true;
                }
            }
            if (!found)
            {
                Console.WriteLine($"no missing items in items.xlsx");
            }
        }

        private async Task AddItemsAsync(List<Item> items)
        {
            var examenCollection = _unitOfWork.GetCollection<ExamenAnalysisMetadata>();
            var itemCollection = _unitOfWork.GetCollection<Item>();
            var existingItems = itemCollection.AsQueryable().ToList();
            var alleExamens = examenCollection.AsQueryable().ToList();
            var examenCodes = alleExamens.Select(a => a.ExamenId).Distinct().ToHashSet();
            foreach (var item in items.Where(i => examenCodes.Contains(i.ExamenId)))
            {
                var existingItem = existingItems.FirstOrDefault(i => i.ExamenId == item.ExamenId && i.Volgnummer == item.Volgnummer);

                if (existingItem == null)
                {
                    Console.WriteLine($"Adding item: examen id: {item.ExamenId} volgnr: {item.Volgnummer}");
                    await itemCollection.AddAsync(item);
                }
                else
                {
                    if (overrideExistingValues)
                    {
                        item.Id = existingItem.Id;
                        await itemCollection.UpdateAsync(item);
                        Console.WriteLine($"Updating item: examen id: {item.ExamenId} volgnr: {item.Volgnummer}");
                    }
                    else
                    {
                        Console.WriteLine($"Skipping item: examen id: {item.ExamenId} volgnr: {item.Volgnummer}");
                    }
                }
            }
            await UpdateItemsInExamensAsync<Examen>(items, alleExamens);
            await UpdateItemsInExamensAsync<ExamenAnalysisMetadata>(items, alleExamens);
        }

        //MyGenericClass<T> where T : IComparable<T>, new()

        private async Task UpdateItemsInExamensAsync<T>(List<Item> newItems, List<ExamenAnalysisMetadata> alleExamensMetadata) where T : Examen, new()
        {
            var examenCollection = _unitOfWork.GetCollection<T>();

            var changedExamens = new Dictionary<int, T>();
            var alleExamens = typeof(T) == typeof(ExamenAnalysisMetadata) ? alleExamensMetadata.Select(e => e as T) : examenCollection.AsQueryable().ToList();
            var metadataLookup = alleExamensMetadata.ToDictionary(a => a.ExamenId,
                a => a.Examenonderdelen.Where(e => e.Type == ExamenonderdeelType.Domein || e.Type == ExamenonderdeelType.Subdomein)
                .SelectMany(domein => domein.ItemVolgnummers)
                .Distinct()
                .Select(volgnummer =>
                {
                    var domeinen = a.Examenonderdelen.Where(e => e.Type == ExamenonderdeelType.Domein || e.Type == ExamenonderdeelType.Subdomein);
                    return new { Volgnummer = volgnummer, Domeinen = domeinen.Where(domein => domein.ItemVolgnummers.Contains(volgnummer)).Select(domein => domein.Naam).ToList() };
                })
                .ToDictionary(i => i.Volgnummer, i => i.Domeinen));

            var alleOpgaven = alleExamens
                            .SelectMany(t => t.Opgaven.Select(ot => new
                            {
                                opgave = ot,
                                examen = t
                            })).ToList();
            var itemExamenList = alleOpgaven
                .SelectMany(o => o.opgave.Items.Select(item => new
                {
                    key = $"{o.examen.ExamenId}|{item.Volgnummer}",
                    item = item,
                    examen = o.examen
                }))
                .ToList();
            var grouped = itemExamenList.GroupBy(i => i.key,
                i => new { examen = i.examen, item = i.item },
                 (key, g) => new { code = key, Items = g.ToList() }).ToList();

            var doubles = grouped.Where(g => g.Items.Count > 1).ToList();

            var examsThatContainDoubles = doubles
                .Select(g => int.Parse(g.code.Split("|").FirstOrDefault()))
                .Distinct()
                .ToHashSet();

            var itemExamenLookup = itemExamenList
                .Where(i => !examsThatContainDoubles.Contains(i.examen.ExamenId))
                .ToDictionary(t => $"{t.examen.ExamenId}|{t.item.Volgnummer}", t => new
                {
                    examen = t.examen,
                    Item = t.item
                });

            // check sequence 
            Console.WriteLine($"");
            Console.WriteLine($"");
            Console.WriteLine($"--------------------------------");
            Console.WriteLine($"--- CHECKING MISSING ITEMS ---");
            Console.WriteLine($"--------------------------------");
            var missing = 0;
            foreach (var examen in alleExamens)
            {

                for (int i = 0; i < examen.AantalItems; i++)
                {
                    var volgnummer = 1 + i;
                    var key = $"{examen.ExamenId}|{volgnummer}";
                    if (!itemExamenLookup.ContainsKey(key))
                    {
                        Console.WriteLine($"Missing item {key}");
                        missing++;
                    }

                }
            }
            Console.WriteLine(missing == 0 ? "No missing items found" : $"Found: {missing} missing items");

            foreach (var item in newItems)
            {

                var itemKey = $"{item.ExamenId}|{item.Volgnummer}";
                if (itemExamenLookup.ContainsKey(itemKey))
                {
                    var itemExamen = itemExamenLookup[itemKey];
                    var itm = itemExamen.Item;
                    itm.Domeinen = new List<string>();
                    if (metadataLookup.ContainsKey(itemExamen.examen.ExamenId))
                    {
                        var domeinInfo = metadataLookup[itemExamen.examen.ExamenId];
                        if (domeinInfo.ContainsKey(item.Volgnummer))
                        {
                            itm.Domeinen = domeinInfo[item.Volgnummer];

                        }
                        else
                        {
                            Console.WriteLine($"Item {itemExamen.examen.ExamenId}|{item.Volgnummer} has no domain info");
                        }

                    }
                    else
                    {
                        Console.WriteLine($"No domains for examen {itemExamen.examen.ExamenId}");
                    }


                    itm.Code = item.Code;
                    itm.Calamiteit = item.Calamiteit;
                    itm.AantalAlternatieven = item.AantalAlternatieven;
                    itm.Maxscore = item.MaxScore;
                    itm.Sleutel = item.Sleutel;
                    itm.Titel = item.Titel;

                    if (!changedExamens.ContainsKey(itemExamen.examen.ExamenId))
                    {
                        // store ref to assessment in a dictionary so it can be saved at the end
                        // instead of for each item.
                        changedExamens.Add(itemExamen.examen.ExamenId, itemExamen.examen);
                    }
                }
            }
            foreach (var changedExamen in changedExamens.Values)
            {
                Console.WriteLine($"Updating assessment: {changedExamen.ExamenId} with added items");
                await examenCollection.UpdateAsync(changedExamen);
            }
        }
        private async Task AddExamensWithoutItemsAsync(List<SchaalRij> schalen)
        {
            var allItems = _unitOfWork.GetCollection<Item>().AsQueryable().ToList();

            var examenAnalysisRepos = _unitOfWork.GetCollection<ExamenAnalysisMetadata>();
            var examenRepos = _unitOfWork.GetCollection<Examen>();

            var existingExamenAnalysis = examenAnalysisRepos.AsQueryable().ToList();
            var existingExamens = examenRepos.AsQueryable().ToList();

            var uniqueExamens = schalen.Select(s => s.ExamenId).Distinct()
                .ToDictionary(code => code, code => schalen.Where(s => s.ExamenId == code).ToList());

            foreach (var examenKeyValuePair in uniqueExamens)
            {
                var examenRow = examenKeyValuePair.Value.FirstOrDefault();
                var rows = examenKeyValuePair.Value;
                var opgaven = rows.Where(r => r.ExamenonderdeelType == ExamenonderdeelType.Examenonderdeel).ToList();
                if (!opgaven.Any())
                {
                    var fakeOpgaveRow = new SchaalRij()
                    {
                        ExamenonderdeelNaam = "",
                        ExamenonderdeelItemVolgnummers = new List<int>()
                    };
                    for (int i = 0; i < examenRow.ExamenAantalItems; i++)
                    {
                        fakeOpgaveRow.ExamenonderdeelItemVolgnummers.Add(1 + i);
                    }
                    opgaven.Add(fakeOpgaveRow);
                }
                var examen = new Examen
                {
                    ExamenId = examenRow.ExamenId,
                    Jaar = examenRow.Jaar,
                    NTerm = examenRow.ExamenNTerm,
                    AantalItems = examenRow.ExamenAantalItems,
                    Correctievoorschrift = examenRow.Correctievoorschrift,
                    Opgavenboekje = examenRow.Opgavenboekje,
                    Uitwerkbijlage = examenRow.Uitwerkbijlage,
                    Tekstboekje = examenRow.Tekstboekje,
                    Leerweg = examenRow.Leerweg,
                    Opleidingsniveau = examenRow.Opleidingsniveau,
                    Tijdvak = examenRow.Tijdvak,
                    Vaknaam = examenRow.Vak.Replace("(pilot)", "").Replace("CSE", "").Trim(),
                    IsPilot = examenRow.Vak.Contains("(pilot"),
                    Vakcode = examenRow.Vakcode,
                    Opgaven = opgaven.Select(opgaveRow =>
                    {
                        return new Opgave
                        {
                            Titel = opgaveRow.ExamenonderdeelNaam,
                            Items = opgaveRow.ExamenonderdeelItemVolgnummers.Select(nummer =>
                            {
                                var matchingItem = allItems.FirstOrDefault(i => i.ExamenId == examenRow.ExamenId && nummer == i.Volgnummer);
                                return new ItemInfo
                                {
                                    Code = matchingItem != null ? matchingItem.Code : "",
                                    Maxscore = matchingItem != null ? matchingItem.MaxScore : 0,
                                    Volgnummer = nummer,
                                    Titel = matchingItem?.Titel,
                                    AantalAlternatieven = matchingItem != null ? matchingItem.AantalAlternatieven : 0,
                                    Sleutel = matchingItem != null ? matchingItem.Sleutel : "",
                                };
                            })
                            .OrderBy(i => i.Volgnummer)
                            .ToList()
                        };
                    }).ToList()
                };

                var examenMetadata = new ExamenAnalysisMetadata(examen)
                {
                    Schaallengte = examenRow.ExamenSchaallengte,
                    Examenonderdelen = rows.Select(row =>
                    {
                        return new Examenonderdeel
                        {
                            ItemVolgnummers = row.ExamenonderdeelItemVolgnummers,
                            K = row.K,
                            MaxScore = row.ExamenonderdeelMaxScore,
                            Naam = row.ExamenonderdeelNaam,
                            NaamHtml = row.ExamenOnderdeelNaamHtml,
                            Type = row.ExamenonderdeelType,
                            SdScore = row.SdScore,
                            GemiddeldeScore = row.GemiddeldeScore
                        };
                    }).ToList()
                };
                examen.Domeinen = examenMetadata.Examenonderdelen.Where(e =>
                e.Type == ExamenonderdeelType.Domein ||
                e.Type == ExamenonderdeelType.Subdomein)
                    .Select(d => d.Naam)
                    .Distinct()
                    .Select(domeinnaam =>
                    {
                        var matching = examenMetadata.Examenonderdelen.FirstOrDefault(e =>
               (e.Type == ExamenonderdeelType.Domein ||
                e.Type == ExamenonderdeelType.Subdomein) && e.Naam == domeinnaam);
                        return new DomeinInfo
                        {
                            Titel = domeinnaam,
                            TitelHtml = matching.NaamHtml,
                        };
                    })
                    .ToList();
                examenMetadata.Domeinen = examen.Domeinen;
                var existingExamen = existingExamens.FirstOrDefault(t => t.ExamenId == examen.ExamenId);
                if (existingExamen != null)
                {
                    // Just override
                    Console.WriteLine($"Overwriting assessment {existingExamen.GetExamenNaam()}");
                    examen.Id = existingExamen.Id;
                    await examenRepos.UpdateAsync(examen);
                }
                else
                {
                    Console.WriteLine($"Adding assessment {examen.GetExamenNaam()}");
                    await examenRepos.AddAsync(examen);
                }
                var existingExamenAnylysis = existingExamenAnalysis.FirstOrDefault(t => t.ExamenId == examen.ExamenId);
                if (existingExamenAnylysis != null)
                {
                    // Just override
                    Console.WriteLine($"Overwriting assessment metadata {existingExamenAnylysis.GetExamenNaam()}");
                    examenMetadata.Id = existingExamenAnylysis.Id;
                    await examenAnalysisRepos.UpdateAsync(examenMetadata);
                }
                else
                {
                    Console.WriteLine($"Adding assessment {examenMetadata.GetExamenNaam()}");
                    await examenAnalysisRepos.AddAsync(examenMetadata);
                }
            }

        }

        private async Task AddClustersPerNiveauAsync(List<SchaalRij> schalen)
        {
            var clustersPerNiveau = new List<ClustersPerNiveau>();
            foreach (var n in AlleOpleidingNiveaus())
            {
                var clusters = new List<Cluster>();
                var schalenPerNiveau = schalen.Where(s => s.Leerweg == n.leerweg && s.Opleidingsniveau == n.opleidingsniveau).ToList();
                var rowsPerCluster = schalenPerNiveau.Select(s => s.Cluster)
                        .Distinct()
                        .ToDictionary(cluster => cluster, cluster => schalenPerNiveau.Where(s => s.Cluster == cluster).ToList());
                foreach (var rowPerCluster in rowsPerCluster)
                {
                    var row = rowPerCluster.Value;
                    var cluster = new Cluster
                    {
                        Naam = rowPerCluster.Key.GetDescription(),
                        Vakken = row.Select(r => r.Vakcode).Distinct().Select(vakcode =>
                        {
                            var vakRow = row.FirstOrDefault(r => r.Vakcode == vakcode);
                            return new VakInfo
                            {
                                Code = vakRow.Vakcode,
                                Naam = vakRow.Vak.Replace("(pilot)", "").Replace("CSE", "").Trim()
                            };
                        }).ToList()
                    };
                    clusters.Add(cluster);

                }
                clustersPerNiveau.Add(new ClustersPerNiveau
                {
                    Clusters = clusters,
                    Opleidingsniveau = n.opleidingsniveau,
                    Leerweg = n.leerweg,
                });
            }
            var clustersPerNiveauRepos = _unitOfWork.GetCollection<ClustersPerNiveau>();
            var existingClusters = clustersPerNiveauRepos.AsQueryable().ToList();
            foreach (var clusterPerNiveau in clustersPerNiveau)
            {
                // try to merge if there's already data.
                var existing = existingClusters.FirstOrDefault(existingClusterPerNiveau =>
                {
                    var opleidingsniveauEquals = existingClusterPerNiveau.Opleidingsniveau == clusterPerNiveau.Opleidingsniveau;
                    if (!opleidingsniveauEquals) return false;
                    var leerwegHasValueEquals = existingClusterPerNiveau.Leerweg.HasValue == clusterPerNiveau.Leerweg.HasValue;
                    if (!leerwegHasValueEquals) return false;
                    var leerwegHaveValue = existingClusterPerNiveau.Leerweg.HasValue && clusterPerNiveau.Leerweg.HasValue;
                    if (!leerwegHaveValue) return true;
                    return existingClusterPerNiveau.Leerweg.Value == clusterPerNiveau.Leerweg.Value;

                });
                if (existing != null)
                {
                    var hasChanged = false;
                    foreach (var cluster in clusterPerNiveau.Clusters)
                    {
                        var matchingCluster = existing.Clusters.FirstOrDefault(c => c.Naam == cluster.Naam);
                        if (matchingCluster != null)
                        {
                            foreach (var vak in cluster.Vakken)
                            {
                                var matchingVak = matchingCluster.Vakken.FirstOrDefault(v => v.Naam == vak.Naam);
                                if (matchingVak == null)
                                {
                                    matchingCluster.Vakken.Add(vak);
                                    hasChanged = true;
                                }
                                else if (overrideExistingValues)
                                {
                                    matchingCluster.Vakken.Remove(matchingVak);
                                    matchingCluster.Vakken.Add(vak);
                                    hasChanged = true;
                                }
                            }
                        }
                        else
                        {
                            existing.Clusters.Add(cluster);
                            hasChanged = true;
                        }
                    }
                    if (hasChanged)
                    {
                        await clustersPerNiveauRepos.UpdateAsync(existing);
                        Console.WriteLine($"Updating clusters for {clusterPerNiveau.Opleidingsniveau.OpleidingsniveauOmschrijving(clusterPerNiveau.Leerweg)}");
                    }
                    else
                    {
                        Console.WriteLine($"Skipping clusters for {clusterPerNiveau.Opleidingsniveau.OpleidingsniveauOmschrijving(clusterPerNiveau.Leerweg)} (no changes)");
                    }
                }
                else
                {
                    Console.WriteLine($"Adding clusters for {clusterPerNiveau.Opleidingsniveau.OpleidingsniveauOmschrijving(clusterPerNiveau.Leerweg)}");
                    await clustersPerNiveauRepos.AddAsync(clusterPerNiveau);
                }

            }
        }

        private List<(Leerweg? leerweg, Opleidingsniveau opleidingsniveau)> AlleOpleidingNiveaus()
        {
            var list = new List<(Leerweg? leerweg, Opleidingsniveau opleidingsniveau)>();
            foreach (Opleidingsniveau opleidingsniveau in Enum.GetValues(typeof(Opleidingsniveau)))
            {
                if (opleidingsniveau == Opleidingsniveau.VO_VMBO)
                {
                    foreach (Leerweg leerweg in Enum.GetValues(typeof(Opleidingsniveau)))
                    {
                        list.Add((leerweg, opleidingsniveau));
                    }
                }
                else
                {
                    list.Add((null, opleidingsniveau));
                }
            }
            return list;
        }


        private List<Item> ReadItemsExcel()
        {
            var list = new List<Item>();
            using (var fileStream =
                File.OpenRead(Path.Combine(AppDomain.CurrentDomain.BaseDirectory,
                    $"data/items.xlsx")))
            {
                using (var reader = ExcelReaderFactory.CreateReader(fileStream))
                {
                    // code	DatasetNr	ItSeqNumber	ItemTypeNr	MCKey	MaxScor

                    var contents = GetDataSet(reader);
                    foreach (DataRow row in contents.Tables[0].Rows)
                    {
                        var code = int.Parse(row[0].ToString());
                        var examenId = int.Parse(row["DatasetNr"].ToString());
                        var volgerdeInExamen = int.Parse(row["ItSeqNumber"].ToString());
                        var sleutel = row["MCKey"].ToString();
                        if (!int.TryParse(row["nAlt"].ToString(), out var aantalAlternatieven))
                        {
                            aantalAlternatieven = 0;
                        };
                        var calamiteitValue = row["Calamity"].ToString().ParseToIntSafe();
                        var calamiteit = calamiteitValue.HasValue && calamiteitValue.Value == 1;
                        var maxScore = int.Parse(row["MaxScor"].ToString());
                        list.Add(new Item
                        {
                            Code = code.ToString(),
                            ExamenId = examenId,
                            Sleutel = sleutel,
                            MaxScore = maxScore,
                            Volgnummer = volgerdeInExamen,
                            AantalAlternatieven = aantalAlternatieven,
                            Calamiteit = calamiteit
                        });
                    }
                }
            }
            return list;
        }

        private List<SchaalRij> ReadSchalenExcel()
        {

            var list = new List<SchaalRij>();
            using (var fileStream =
                File.OpenRead(Path.Combine(AppDomain.CurrentDomain.BaseDirectory,
                    $"data/schalen.xlsx")))
            {
                using (var reader = ExcelReaderFactory.CreateReader(fileStream))
                {
                    // nex_schaallengte | nex_aantal_items | SubtestNr | Title | Contents | Openbaar | Type subtoets | Link naar curriculum | Vermoedde domeinnaam in curriculum | schooltype | tijdvak	examens met (sub)domeinen (waar we iets aan hebben) | cspe | exact | filter op vak (ik verander de formule in deze kolom elke keer als ik met een ander vak begin)| Link naar wikiwijs
                    var contents = GetDataSet(reader);
                    // TODO, cluster info in excel?
                    foreach (DataRow row in contents.Tables[0].Rows)
                    {
                        var naamVolledig = row["nex_omschrijving"].ToString();
                        var examenonderdeelType = row["Type subtoets"].ToString().GetExamenonderdeelType();
                        var splittedNaam = naamVolledig.Split(' ');
                        var niveau = splittedNaam[0].ConvertToOpleidingsniveau();
                        var leerweg = splittedNaam[0].GetLeerweg();

                        // skip row if: not vmbo gl-tl, havo or vwo, or Type subtoets is unknown
                        if ((!leerweg.HasValue || leerweg.HasValue && leerweg.Value == Leerweg.VMBO_GL_TL)
                            && examenonderdeelType != null)
                        {

                            var cluster = row["cluster"].ToString().GetClusterType();
                            var toetsCode = int.Parse(row["nex_id"].ToString());

                            var opgavenboek = row["Opgavenboekje"].ToString();
                            var correctievoorschrift = row["Correctievoorschrift"].ToString();
                            var uitwerkbijlage = row["Uitwerkbijlage"].ToString();
                            var tekstboekje = row["Tekstboekje"].ToString();

                            var indexOfTijdvak = splittedNaam.ToList().IndexOf("tijdvak");
                            var jaar = int.Parse(splittedNaam[indexOfTijdvak - 1]);
                            var vak = string.Join(' ', splittedNaam
                                    .Skip(1)
                                    .Take(indexOfTijdvak - 2));
                            var vakcode = row["vak_nummer"].ToString();
                            var tijdvak = int.Parse(splittedNaam.Last());
                            var examenSchaallengte = int.Parse(row["nex_schaallengte"].ToString());
                            var examenAantalItems = int.Parse(row["nex_aantal_items"].ToString());
                            var subTestNummer = int.Parse(row["SubtestNr"].ToString());
                            var subTestNaam = row["Title"].ToString().Trim();
                            var itemSequenceNumbers = row["Contents"].ToString().Split(",")
                                  .Select(c => int.Parse(c))
                                  .ToList();

                            var curriculumLink = row["Link naar examenprogramma"].ToString();
                            var k = row["K"].ToString().ParseToIntSafe();
                            var examenonderdeelMaxScore = row["MaxS"].ToString().ParseToIntSafe();
                            if (examenonderdeelMaxScore == null && (
                                examenonderdeelType == ExamenonderdeelType.Domein ||
                                examenonderdeelType == ExamenonderdeelType.Subdomein))
                            {
                                throw new Exception("Domein has no maxscore");
                            }
                            // N	gem,score	sd,score	K	MaxS	nex_n_term
                            var n = row["N"].ToString().ParseToIntSafe();
                            var gemScore = row["gem,score"].ToString().ParseToDoubleSafe();
                            var sdScore = row["sd,score"].ToString().ParseToDoubleSafe();
                            if (gemScore == null || sdScore == null)
                            {
                                _logger.LogWarning($"gem,score and/or sd,score are empty for: {naamVolledig}");
                            }
                            var domeinInfo = subTestNaam.MarkdownToHtml(_markdown);
                            var nTerm = double.Parse(row["nex_n_term"].ToString());
                            list.Add(new SchaalRij
                            {
                                Cluster = cluster,
                                CurriculumLink = curriculumLink,
                                Jaar = jaar,
                                K = k,
                                Leerweg = leerweg,
                                Opleidingsniveau = niveau,
                                GemiddeldeScore = gemScore,
                                SdScore = sdScore,
                                ExamenonderdeelItemVolgnummers = itemSequenceNumbers,
                                ExamenonderdeelMaxScore = examenonderdeelMaxScore,
                                ExamenonderdeelNaam = domeinInfo.plain,
                                ExamenOnderdeelNaamHtml = domeinInfo.html,
                                ExamenonderdeelNummer = subTestNummer,
                                ExamenonderdeelType = examenonderdeelType.Value,
                                Correctievoorschrift = correctievoorschrift,
                                Opgavenboekje = opgavenboek,
                                Uitwerkbijlage = uitwerkbijlage,
                                Tekstboekje = tekstboekje,
                                Tijdvak = tijdvak,
                                ExamenAantalItems = examenAantalItems,
                                ExamenId = toetsCode,
                                ExamenSchaallengte = examenSchaallengte,
                                Vak = vak,
                                ExamenNTerm = nTerm,
                                Vakcode = vakcode
                            });

                        }
                        // VWO wiskunde C  2018 tijdvak 1
                        //K MaxS
                    }
                }
            }
            return list;
        }


        class SchaalRij
        {
            public ClusterType Cluster { get; set; }
            public int ExamenId { get; set; }
            public Opleidingsniveau Opleidingsniveau { get; set; }
            public Leerweg? Leerweg { get; set; }

            public int Jaar { get; set; }
            public string Vak { get; set; }
            public string Vakcode { get; set; }
            public int Tijdvak { get; set; }
            public int ExamenSchaallengte { get; set; }
            public int ExamenAantalItems { get; set; }
            public double ExamenNTerm { get; set; }
            public double? GemiddeldeScore { get; set; }
            public double? SdScore { get; set; }
            public int? N { get; set; }
            public int ExamenonderdeelNummer { get; set; }
            public string Opgavenboekje { get; set; }
            public string Uitwerkbijlage { get; set; }

            public string Tekstboekje { get; set; }
            public string Correctievoorschrift { get; set; }
            public string ExamenonderdeelNaam { get; set; }
            public string ExamenOnderdeelNaamHtml { get; set; }
            public List<int> ExamenonderdeelItemVolgnummers { get; set; }
            public ExamenonderdeelType ExamenonderdeelType { get; set; }
            public List<DomeinInfo> Onderdelen { get; set; }
            public string CurriculumLink { get; set; }
            public int? K { get; set; }
            public int? ExamenonderdeelMaxScore { get; set; }
        }


        private static DataSet GetDataSet(IExcelDataReader reader)
        {
            var contents = reader.AsDataSet(new ExcelDataSetConfiguration
            {
                UseColumnDataType = true,
                ConfigureDataTable = dataReader => new ExcelDataTableConfiguration
                {
                    UseHeaderRow = true
                }
            });
            return contents;
        }
    }
}