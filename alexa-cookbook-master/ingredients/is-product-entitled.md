# Checking An In-Skill Product for Entitlement

By passing your product object to this helper function, you will receive a boolean value representing whether or not the user owns that product.

    function isEntitled(product)
    {
        return isProduct(product) && product[0].entitled == 'ENTITLED';
    }
