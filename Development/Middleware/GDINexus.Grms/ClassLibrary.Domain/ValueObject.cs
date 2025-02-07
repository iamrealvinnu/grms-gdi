#region Copyright GDI Nexus © 2025

//
// NAME:			ValueObject.cs
// AUTHOR:			Girish Girigowda
// COMPANY:			GDI Nexus
// DATE:			01/17/2025
// PURPOSE:			Value Object
//

#endregion

namespace ClassLibrary.Domain;

/// <summary>
///     Base class for value objects in domain
///     Value
/// </summary>
/// <typeparam name="TValueObject">The type of this value object</typeparam>
public abstract class ValueObject<TValueObject> : IEquatable<TValueObject>
    where TValueObject : ValueObject<TValueObject>
{
    #region IEquatable and Override Equals operators

    /// <summary>
    ///     <see cref="M:System.Object.IEquatable{TValueObject}" />
    /// </summary>
    /// <param name="other">
    ///     <see cref="M:System.Object.IEquatable{TValueObject}" />
    /// </param>
    /// <returns>
    ///     <see cref="M:System.Object.IEquatable{TValueObject}" />
    /// </returns>
    public bool Equals(TValueObject other)
    {
        if ((object)other == null)
            return false;

        if (ReferenceEquals(this, other))
            return true;

        // Compare all public properties
        var publicProperties = GetType().GetProperties();

        if (publicProperties.Any())
            return publicProperties.All(p =>
            {
                var left = p.GetValue(this, null);
                var right = p.GetValue(other, null);
                if (left is TValueObject)
                    // Check not self-references...
                    return ReferenceEquals(left, right);
                return left != null && left.Equals(right);
            });
        return true;
    }

    /// <summary>
    ///     <see cref="M:System.Object.Equals" />
    /// </summary>
    /// <param name="obj">
    ///     <see cref="M:System.Object.Equals" />
    /// </param>
    /// <returns>
    ///     <see cref="M:System.Object.Equals" />
    /// </returns>
    public override bool Equals(object obj)
    {
        if (obj == null)
            return false;
        if (ReferenceEquals(this, obj))
            return true;
        var item = obj as ValueObject<TValueObject>;
        return (object)item != null && Equals((TValueObject)item);
    }

    /// <summary>
    ///     <see cref="M:System.Object.GetHashCode" />
    /// </summary>
    /// <returns>
    ///     <see cref="M:System.Object.GetHashCode" />
    /// </returns>
    public override int GetHashCode()
    {
        var hashCode = 31;
        var changeMultiplier = false;
        var index = 1;

        // Compare all public properties
        var publicProperties = GetType().GetProperties();

        if (publicProperties.Any())
            foreach (var item in publicProperties)
            {
                var value = item.GetValue(this, null);
                if (value != null)
                {
                    hashCode = hashCode * (changeMultiplier ? 59 : 114) + value.GetHashCode();
                    changeMultiplier = !changeMultiplier;
                }
                else
                {
                    hashCode =
                        hashCode ^ (index * 13); // Only for support {"a",null,null,"a"} <> {null,"a","a",null}
                }
            }

        return hashCode;
    }

    /// <summary>
    ///     Equal
    /// </summary>
    /// <returns>
    ///     <see cref="M:System.Boolean" />
    /// </returns>
    public static bool operator ==(ValueObject<TValueObject> left, ValueObject<TValueObject> right)
    {
        return Equals(left, null) ? Equals(right, null) : left.Equals(right);
    }

    /// <summary>
    ///     Not equal
    /// </summary>
    /// <returns>
    ///     <see cref="M:System.Boolean" />
    /// </returns>
    public static bool operator !=(ValueObject<TValueObject> left, ValueObject<TValueObject> right)
    {
        return !(left == right);
    }

    #endregion
}