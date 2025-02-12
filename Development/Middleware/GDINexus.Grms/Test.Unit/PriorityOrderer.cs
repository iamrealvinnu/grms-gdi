#region Copyright GDI Nexus © 2025

//
// NAME:			PriorityOrderer.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Priority orderer for tests
//

#endregion

using Xunit.Abstractions;
using Xunit.Sdk;

namespace Test.Unit;

/// <summary>
///     Represents the <see cref="PriorityOrderer" /> class.
/// </summary>
public class PriorityOrderer : ITestCaseOrderer
{
    /// <summary>
    ///     Order test cases.
    /// </summary>
    /// <typeparam name="TTestCase"></typeparam>
    /// <param name="testCases"></param>
    /// <returns></returns>
    public IEnumerable<TTestCase> OrderTestCases<TTestCase>(IEnumerable<TTestCase> testCases)
        where TTestCase : ITestCase
    {
        var sortedMethods = new SortedDictionary<int, List<TTestCase>>();

        foreach (var testCase in testCases)
        {
            var priority = 0;

            foreach (var attr in testCase.TestMethod.Method.GetCustomAttributes(typeof(TestPriorityAttribute)
                         .AssemblyQualifiedName))
                priority = attr.GetNamedArgument<int>("Priority");

            GetOrCreate(sortedMethods, priority).Add(testCase);
        }

        foreach (var list in sortedMethods.Keys.Select(priority => sortedMethods[priority]))
        {
            list.Sort((x, y) =>
                StringComparer.OrdinalIgnoreCase.Compare(x.TestMethod.Method.Name, y.TestMethod.Method.Name));
            foreach (var testCase in list)
                yield return testCase;
        }
    }

    /// <summary>
    ///     Get or create order.
    /// </summary>
    /// <typeparam name="TKey"></typeparam>
    /// <typeparam name="TValue"></typeparam>
    /// <param name="dictionary"></param>
    /// <param name="key"></param>
    /// <returns></returns>
    private static TValue GetOrCreate<TKey, TValue>(IDictionary<TKey, TValue> dictionary, TKey key) where TValue : new()
    {
        if (dictionary.TryGetValue(key, out var result)) return result;

        result = new TValue();
        dictionary[key] = result;

        return result;
    }
}