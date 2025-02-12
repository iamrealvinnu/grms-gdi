#region Copyright GDI Nexus © 2025

//
// NAME:			TestPriorityAttribute.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Test priority attribute
//

#endregion

namespace Test.Unit;

/// <summary>
///     Represents the <see cref="TestPriorityAttribute" /> class.
/// </summary>
[AttributeUsage(AttributeTargets.Method)]
public class TestPriorityAttribute : Attribute
{
    /// <summary>
    ///     Priority Attribute.
    /// </summary>
    /// <param name="priority"></param>
    public TestPriorityAttribute(int priority)
    {
        Priority = priority;
    }

    /// <summary>
    ///     Priority.
    /// </summary>
    public int Priority { get; private set; }
}