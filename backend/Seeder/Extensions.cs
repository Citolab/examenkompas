using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Citolab.Examenkompas.Models;
using HtmlAgilityPack;
using MarkdownSharp;

namespace Citolab.Examenkompas.Seeder
{
    public static class Extensions
    {
        public static string ReplaceFirst(this string text, string search, string replace)
        {
            var pos = text.IndexOf(search, StringComparison.Ordinal);
            if (pos < 0)
            {
                return text;
            }
            return text.Substring(0, pos) + replace + text.Substring(pos + search.Length);
        }
        public static string ReplaceLast(this string text, string search, string replace)
        {
            var pos = text.LastIndexOf(search, StringComparison.Ordinal);
            if (pos < 0)
            {
                return text;
            }
            return text.Substring(0, pos) + replace + text.Substring(pos + search.Length);
        }

        public static int GetOccurences(this string text, string search) =>
            Regex.Matches(Regex.Escape(text), search).Count;

        public static string GetUrl(this string html)
        {

            var doc = new HtmlDocument();
            doc.LoadHtml(html);
            var anchor = doc.DocumentNode.Descendants()
                    .FirstOrDefault(d => d.Name == "a");
            var href = anchor.Attributes
                    .FirstOrDefault(a => a.Name == "href");
            return href.Value;
        }

        public static string Text(this string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);
            return doc.DocumentNode.InnerText;
        }

        public static string DocElement(this string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);
            return doc.DocumentNode.FirstChild.Name == "p" ?
                doc.DocumentNode.FirstChild.InnerHtml :
                doc.DocumentNode.InnerHtml;
        }

        public static string ConvertToPlainText(this string html)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(html);

            StringWriter sw = new StringWriter();
            ConvertTo(doc.DocumentNode, sw);
            sw.Flush();
            return sw.ToString();
        }

        private static void ConvertTo(HtmlNode node, TextWriter outText)
        {
            string html;
            switch (node.NodeType)
            {
                case HtmlNodeType.Comment:
                    // don't output comments
                    break;

                case HtmlNodeType.Document:
                    ConvertContentTo(node, outText);
                    break;

                case HtmlNodeType.Text:
                    // script and style must not be output
                    string parentName = node.ParentNode.Name;
                    if ((parentName == "script") || (parentName == "style"))
                        break;

                    // get text
                    html = ((HtmlTextNode)node).Text;

                    // is it in fact a special closing node output as text?
                    if (HtmlNode.IsOverlappedClosingElement(html))
                        break;

                    // check the text is meaningful and not a bunch of whitespaces
                    if (html.Trim().Length > 0)
                    {
                        outText.Write(HtmlEntity.DeEntitize(html));
                    }
                    break;

                case HtmlNodeType.Element:
                    switch (node.Name)
                    {
                        case "p":
                            // treat paragraphs as crlf
                            outText.Write("\r\n");
                            break;
                        case "br":
                            outText.Write("\r\n");
                            break;
                    }

                    if (node.HasChildNodes)
                    {
                        ConvertContentTo(node, outText);
                    }
                    break;
            }
        }
        private static void ConvertContentTo(HtmlNode node, TextWriter outText)
        {
            foreach (HtmlNode subnode in node.ChildNodes)
            {
                ConvertTo(subnode, outText);
            }
        }

        public static (string plain, string link) ConvertMarkdown(this string value, Markdown markdown)
        {
            var plain = value;
            var link = string.Empty;
            if (value.Contains("[") && value.Contains("]") && value.Contains("http"))
            {
                var html = markdown.Transform(value).Trim();
                link = html.GetUrl();
                plain = html.ConvertToPlainText().Trim();
            }
            return (plain, link);
        }

        public static (string plain, string html) MarkdownToHtml(this string value, Markdown markdown)
        {
            var plain = value;
            var html = value;
            if (value.Contains("[") && value.Contains("]") && value.Contains("http"))
            {
                var fullhtml = markdown.Transform(value);
                fullhtml = fullhtml.Replace("<a", @"<a target=""_blank"" rel=""norefferrer""");
                plain = fullhtml.ConvertToPlainText().Trim();
                html = fullhtml.DocElement().Trim();
            }
            return (plain, html);
        }
        public static bool ContainsNumber(this string value) => value.Any(char.IsDigit);
    }
}
