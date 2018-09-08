# Getting All Entitled Products for a User

Passing your collection of products to this function will return a list of products that a user has not purchased.

    function getAllEntitledProducts (inSkillProductList) {
        var entitledProductList = inSkillProductList.filter(record => record.entitled == "ENTITLED");
        return entitledProductList;
    }
