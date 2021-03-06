﻿using System.Collections.Generic;
using System.Web.Optimization;
using Bootstrap.Extensions.StartupTasks;
using YangKai.BlogEngine.Common;

namespace YangKai.BlogEngine.Web.Mvc.BootStrapper
{
    public class BundlesConfig : IStartupTask
    {
        public void Run()
        {
            SetOrder();

            BundleJs(
                "~/Content/plugin/syntaxhighlighter_3.0.83/scripts/shCore.js",
                "~/Content/plugin/syntaxhighlighter_3.0.83/scripts/shBrushCSharp.js",
                "~/Content/plugin/syntaxhighlighter_3.0.83/scripts/shBrushJava.js",
                "~/Content/plugin/syntaxhighlighter_3.0.83/scripts/shBrushSql.js",
                "~/Content/plugin/syntaxhighlighter_3.0.83/scripts/shBrushCss.js",
                "~/Content/plugin/syntaxhighlighter_3.0.83/scripts/shBrushJScript.js",
                "~/Content/plugin/syntaxhighlighter_3.0.83/scripts/shBrushXml.js"
                );

            BundleCss(
                "~/Content/plugin/syntaxhighlighter_3.0.83/styles/shCoreDefault.css"
                );

            //BundleTable.EnableOptimizations = true;
        }


        public void Reset()
        {
        }

        private void SetOrder()
        {
            BundleTable.Bundles.FileSetOrderList.AddRange("angular", "messenger", "moment");
        }

        private void BundleJs(params string[] plugin)
        {
            //js
            var bundle = new ScriptBundle("~/js")
                .IncludeDirectory("~/Content/vendor", "*.js", true)
                .IncludeDirectory("~/Content/common", "*.js", true)
                .IncludeDirectory("~/Content/l18n", "*.js", true)
                .IncludeDirectory("~/Content/app", "*.js", true)
                .IncludeDirectory("~/Content/plugin/unify_1.3", "*.js", true)
                .Include(plugin);
            BundleTable.Bundles.Add(bundle);

            //admin-js
            var adminBundle = new ScriptBundle("~/admin-js")
                .IncludeDirectory("~/Content/vendor", "*.js", true)
                .IncludeDirectory("~/Content/common", "*.js", true)
                .IncludeDirectory("~/Content/app-admin", "*.js", true)
                .IncludeDirectory("~/Content/plugin/ace_1.2", "*.js", true)
                .Include(plugin);
            BundleTable.Bundles.Add(adminBundle);
        }

        private void BundleCss(params string[] plugin)
        {
            //css
            var bundle = new StyleBundle("~/Content/style/css")
                .IncludeDirectory("~/Content/vendor", "*.css", true)
                .Include(plugin)
                .IncludeDirectory("~/Content/plugin/unify_1.3", "*.css", false)
                .IncludeDirectory("~/Content/plugin/unify_1.3/theme/default", "*.css", false)
                .IncludeDirectory("~/Content/plugin/unify_1.3/theme/" + Config.ThemeColor, "*.css", false)
                .IncludeDirectory("~/Content/app", "*.css", true);
            BundleTable.Bundles.Add(bundle);

            

            //admin-css
            var adminBundle = new StyleBundle("~/Content/style/admin-css")
                .IncludeDirectory("~/Content/vendor", "*.css", true)
                .Include(plugin)
                .IncludeDirectory("~/Content/plugin/ace_1.2", "*.css", true)
                .IncludeDirectory("~/Content/app-admin", "*.css", true);
            BundleTable.Bundles.Add(adminBundle);
        }
    }

    internal static class MehtondExtension
    {
        public static void Add(this ICollection<BundleFileSetOrdering> list, string item)
        {
            list.Add(new BundleFileSetOrdering(item)
            {
                Files = { item + ".*", item + "*" }
            });
        }

        public static void AddRange(this ICollection<BundleFileSetOrdering> list, params string[] items)
        {
            foreach (var item in items)
            {
                list.Add(item);
            }
        }
    }
}