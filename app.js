// Storage Controller

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure
  const data = {
    items: [
      {id: 0, name: 'Steak Dinner', calories: 1200},
      {id: 1, name: 'Cookie', calories: 400},
      {id: 2, name: 'Eggs', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItem: function() {
      return data.items;
    },
    logData: function(){
      return data;
    }
  }
})();
// UI Controller
const UiCtrl = (function() {
  const UiSelectors = {
    itemList: '#item-list'
  }
  
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
           <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`;
      });

      // Insert list items

      document.querySelector(UiSelectors.itemList).innerHTML = html;
    } 
  }
})();
// App Controller
const App = (function(ItemCtrl, UiCtrl) {
  
  return {
    init: function() {
      // Fetch items from data structure
      const items = ItemCtrl.getItem();

      // Populate list with items
      UiCtrl.populateItemList(items);
    }
  }

})(ItemCtrl, UiCtrl);

App.init();