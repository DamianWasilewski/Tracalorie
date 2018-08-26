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
    items: [],
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItem: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      let ID;
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },
    logData: function(){
      return data;
    }
  }
})();
// UI Controller
const UiCtrl = (function() {
  const UiSelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories'
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
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UiSelectors.itemNameInput).value,
        calories: document.querySelector(UiSelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UiSelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
       <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // Insert item
      document.querySelector(UiSelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    clearInput: function() {
      document.querySelector(UiSelectors.itemNameInput).value = '';
      document.querySelector(UiSelectors.itemCaloriesInput).value = '';
    },
    hideList: function() {
      document.querySelector(UiSelectors.itemList).style.display = 'none';
    },
    getSelectors: function() {
      return UiSelectors;
    }
  }
})();
// App Controller
const App = (function(ItemCtrl, UiCtrl) {
  const loadEventListeners = function() {
    const UiSelectors = UiCtrl.getSelectors();

    document.querySelector(UiSelectors.addBtn).addEventListener('click', itemAddSubmit);
  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get from input from UI Controller
    const input = UiCtrl.getItemInput();

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add to UI list
      UiCtrl.addListItem(newItem);
      // Clear input fields
      UiCtrl.clearInput();
    }
    
    e.preventDefault();
  }


  return {
    init: function() {
      // Fetch items from data structure
      const items = ItemCtrl.getItem();

      // Check if any items
      if(items.length === 0) {
        UiCtrl.hideList();
      } else {
        // Populate list with items
      UiCtrl.populateItemList(items);
      }

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UiCtrl);

App.init();