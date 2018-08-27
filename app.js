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
    getItemById: function(id) {
      let found = null;
      // Loop through items
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        } 
      });
      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      data.items.forEach(function(item) {
        total += item.calories;
      });
      // Set total calories in data structure
      data.totalCalories = total;

      return data.totalCalories;
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
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
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
    addItemToForm: function() {
      document.querySelector(UiSelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UiSelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UiCtrl.showEditState();
    },
    hideList: function() {
      document.querySelector(UiSelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UiSelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function() {
      UiCtrl.clearInput();
      document.querySelector(UiSelectors.updateBtn).style.display = 'none';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'none';
      document.querySelector(UiSelectors.backBtn).style.display = 'none';
      document.querySelector(UiSelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UiSelectors.updateBtn).style.display = 'inline';
      document.querySelector(UiSelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UiSelectors.backBtn).style.display = 'inline';
      document.querySelector(UiSelectors.addBtn).style.display = 'none';
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

    //Edit icon click event
    document.querySelector(UiSelectors.itemList).addEventListener('click', itemUpdateSubmit);
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
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UiCtrl.showTotalCalories(totalCalories);
      // Clear input fields
      UiCtrl.clearInput();
    }
    
    e.preventDefault();
  }
  // Update item submit
  const itemUpdateSubmit = function(e) {
    if(e.target.classList.contains('edit-item')) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;

      const listIdArray = listId.split('-');
      // Get the actual id
      const id = parseInt(listIdArray[1]);
      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      // Add item to form
      UiCtrl.addItemToForm();
    }

    e.preventDefault();
  }

  return {
    init: function() {
      // Clear edit state
      UiCtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItem();

      // Check if any items
      if(items.length === 0) {
        UiCtrl.hideList();
      } else {
        // Populate list with items
      UiCtrl.populateItemList(items);
      }

      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UiCtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UiCtrl);

App.init();