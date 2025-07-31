//--------------------------------
//-------------Таби---------------
//--------------------------------

//Створюємо новий тип, який являє собою об'єкт, який містить поле activeTabIndex
type TabsState = {
  activeTabIndex: number;
};

//Створюємо змінну, яка містить селектор для пошуку елементів з класом data-js-tabs
const rootSelector = "[data-js-tabs]";

//Створюємо клас Tabs, який приймає елемент колекції табів TabsCollection
class Tabs {
  //ПОЛЯ

  //Оголошуємо об'єкт, який містить селектори, які будуть використовуватися в класі
  selectors = {
    root: rootSelector,
    button: "[data-js-tabs-button]",
    content: "[data-js-tabs-content]",
  };

  //Оголошуємо об'єкт, який містить стан активності, який буде використовуватися в класі
  stateClasses = {
    isActive: "is-active",
  };

  //Оголошуємо об'єкт, який містить атрибути, які будуть використовуватися в класі
  //атрибути для людей із порушеннями зору, що користуються скрінрідерами
  attributes = {
    ariaSelected: "aria-selected",
    tabIndex: "tabindex", //визначає порядок фокусування при навігації клавіатурою (0 → активний, -1 → неактивний)
    ariaHidden: "aria-hidden", //визначає чи контент видимий для людей із порушеннями зору, що користуються скрінрідерами
  };

  //Оголошуємо типи для полів
  private rootElement: HTMLElement;
  private buttonCollection: NodeListOf<HTMLElement>;
  private contentCollection: NodeListOf<HTMLElement>;
  private state: TabsState;
  private limitTabsIndex: number;

  //МЕТОДИ

  //Оголошуємо конструктор, який приймає кореневий елемент групи табів
  constructor(rootElement: HTMLElement) {
    //Оголошуємо поле rootElement, яке містить кореневий елемент групи табів
    this.rootElement = rootElement;

    //Оголошуємо поле buttonCollection, яке містить колекцію кнопок табів. Це масив NodeList
    this.buttonCollection = this.rootElement.querySelectorAll(this.selectors.button);

    //Оголошуємо поле contentCollection, яке містить колекцію контенту табів. Це масив NodeList
    this.contentCollection = this.rootElement.querySelectorAll(this.selectors.content);

    //Оголошуємо поле state. Це Proxy об'єкт, який містить поле activeTabIndex. Це число, яке визначає індекс активного табу.
    this.state = this.getProxyState({
      //Перетворення NodeList this.buttonCollection на масив і пошук індексу активного табу
      activeTabIndex: [...this.buttonCollection].findIndex(buttonElement => {
        //проходимо по кожному елементу button з buttonCollection і перевіряємо чи він має клас is-active
        //якщо button має клас is-active, то повертаємо його індекс
        buttonElement.classList.contains(this.stateClasses.isActive);
      }),
    });

    //Оголошуємо поле limitTabsIndex, яке містить максимальний індекс табу. Це число, яке визначає кількість табів.
    //треба для навігацію по кнопкам табу через клавіатуру (ArrowLeft <-, ArrowRight ->)
    this.limitTabsIndex = this.buttonCollection.length - 1;

    //Прив'язуємо події click і keydown до кнопок табів
    this.bindEvents();
  }

  // Створюємо Proxy — обгортку для об'єкта initialState
  // Це дозволяє "перехоплювати" доступ (get) і зміну (set) activeTabIndex
  getProxyState(initialState: TabsState) {
    return new Proxy(initialState, {
      // Коли хтось читає властивість у об'єкта state (наприклад, this.state.activeTabIndex)
      get: (targetObject: TabsState, property: keyof TabsState) => {
        // Просто повертаємо значення цієї властивості
        return targetObject[property];
      },

      // Коли хтось змінює властивість об'єкта state (наприклад, this.state.activeTabIndex = 1)
      set: (
        targetObject: TabsState, // сам об'єкт, що змінюється
        property: keyof TabsState, // назва змінюваної властивості (наприклад, "activeTabIndex")
        value: TabsState[keyof TabsState] // нове значення, яке присвоюється
      ): boolean => {
        targetObject[property] = value; // Оновлюємо значення activeTabIndex в об'єкті state
        this.updateUI(); //оновлюємо інтерфейс при зміні activeTabIndex
        return true; // повертаємо true — означає, що операція присвоєння успішна
      },
    });
  }

  //Оголошуємо метод updateUI, який оновлює інтерфейс після натискання на кнопку табу та зміни активного buttonIndex
  //Змінюємо стан кожної кнопки та контенту на активний чи неактивний в залежності від індексу buttonIndex
  updateUI() {
    //Оголошуємо змінну activeTabIndex, яка містить індекс активного табу через деструктуризацію this.state.activeTabIndex
    const { activeTabIndex } = this.state; // те саме, що і const activeTabIndex = this.state.activeTabIndex;

    //Проходимо по кожному елементу buttonCollection і змінюємо його стан на активний чи неактивний
    // в залежності від індексу buttonIndex
    this.buttonCollection.forEach((button, index) => {
      //Оголошуємо змінну isActive, яка містить значення true чи false в залежності від індексу buttonIndex
      const hasActiveIndex = index === activeTabIndex;
      //true → YES → додати
      //false → NO → видалити

      button.classList.toggle(this.stateClasses.isActive, hasActiveIndex);
      //тобто якщо hasActiveIndex = true, бо index кнопки збігається з activeTabIndex,
      //то до цієї кнопки додасться стан stateClasses.isActive, тобто class is-active в html
      //якщо hasActiveIndex = false, то з цієї кнопки буде видалено стан stateClasses.isActive, тобто class is-active в html

      //Оголошуємо атрибути для людей із порушеннями зору, що користуються скрінрідерами
      button.setAttribute(this.attributes.ariaSelected, hasActiveIndex.toString());
      //hasActiveIndex.toString() отримує значення як рядок "true" або "false" (true → активна, false → неактивна)

      button.setAttribute(this.attributes.tabIndex, hasActiveIndex ? "0" : "-1");
      // tabindex визначає порядок фокусування при навігації кнопкою Tab
      //0 → активний, перейде на цю кнопку і озвучиться
      //-1 → неактивний, не буде переходити на цю кнопку і не озвучиться
    });

    //Проходимо по кожному елементу contentCollection і показуємо чи приховуємо контент
    // в залежності від індексу buttonIndex
    this.contentCollection.forEach((content, index) => {
      // Перевіряємо, чи індекс контенту збігається з активним індексом табу
      const isVisibleContent = index === activeTabIndex;
      // Якщо isVisibleContent = true → показати (додати клас is-active)
      // Якщо isVisibleContent = false → приховати (забрати/не додавати клас is-active)

      const isHiddenContent = !isVisibleContent; //логічне заперечення, щоб зрозуміти, чи цей контент має бути прихованим для скрінрідерів
      // Якщо isVisibleContent = true, то isHiddenContent = false
      // Якщо isHiddenContent = true → прихований (не озвучиться)
      // Якщо isHiddenContent = false → видимий (озвучиться)

      content.classList.toggle(this.stateClasses.isActive, isVisibleContent);
      //тобто якщо isVisibleContent = true, бо index контенту збігається з activeTabIndex,
      //то до цього контенту додасться стан stateClasses.isActive, тобто class is-active в html
      //якщо isVisibleContent = false, то з цього контенту буде видалено стан stateClasses.isActive, тобто class is-active в html

      content.setAttribute(this.attributes.ariaHidden, isHiddenContent.toString());
      //aria-hidden = щоб скрінрідери правильно озвучували лише видимий контент
      //true → прихований (не озвучиться)
      //false → видимий (озвучиться)
    });
  }

  //Оголошуємо метод onButtonClick (для коректної роботи в bindEvents), який викликається при натисканні на кнопку табу
  // і змінює стан активного табу на той, індекс якого buttonIndex = index з bindEvents
  onButtonClick(buttonIndex: number) {
    this.state.activeTabIndex = buttonIndex;

    //Запускаємо метод updateUI, який оновлює інтерфейс після натискання на кнопку табу та зміни активного buttonIndex
    // this.updateUI();  --> приховано, бо додається proxy
  }

  //Оголошуємо метод activateTab, який змінює стан активного табу і переносить фокус на цю кнопку
  activateTab(newTabIndex: number) {
    this.state.activeTabIndex = newTabIndex; //оновлюємо значення activeTabIndex на новий індекс
    // this.updateUI();  --> приховано, бо додається proxy
    this.buttonCollection[newTabIndex].focus(); // переносимо фокус
  }

  //Оголошуємо методи prevTabButton і nextTabButton, які викликаються при натисканні на клавішу клавіатури (ArrowLeft <-, ArrowRight ->)
  //ці методи, оголошені як ссилочні функції, які передаються в onKeyDown action
  prevTabButton = () => {
    //Оголошуємо змінну newTabIndex, яка містить індекс нового активного табу
    const newTabIndex = this.state.activeTabIndex === 0 ? this.limitTabsIndex : this.state.activeTabIndex - 1;

    this.activateTab(newTabIndex); //фокус переноситься на кнопку з індексом newTabIndex
  };
  nextTabButton = () => {
    //Оголошуємо змінну newTabIndex, яка містить індекс нового активного табу
    const newTabIndex = this.state.activeTabIndex === this.limitTabsIndex ? 0 : this.state.activeTabIndex + 1;

    this.activateTab(newTabIndex); //фокус переноситься на кнопку з індексом newTabIndex
  };

  //Оголошуємо метод onKeyDown, який викликається при натисканні на клавішу клавіатури (ArrowLeft <-, ArrowRight ->)
  //цей метод, оголошений як ссилочна функція
  onKeyDown = (event: KeyboardEvent) => {
    //Оголошуємо змінну code, яка містить код клавіші, яка була натиснута
    //code — це властивість об’єкта KeyboardEvent (події клавіатури),
    //code відображає конкретну клавішу на клавіатурі, незалежно від розкладки або того, що друкує ця клавіша.
    //event.code — повертає фізичний код клавіші (наприклад, "KeyA", "Enter", "ArrowLeft").
    const { code } = event; //деструктуризація, те саме const code = event.code
    //Якщо натиснули клавішу стрілка вліво, то code буде "ArrowLeft".

    //Оголошуємо змінну action, яка містить дію, яка буде виконана при натисканні на клавішу клавіатури ("KeyA",  "ArrowLeft").
    const action = {
      ArrowLeft: this.prevTabButton,
      ArrowRight: this.nextTabButton,
    }[code];
    //action це об'єкт, який містить два ключі: ArrowLeft і ArrowRight, значеннями яких є методи prevTabButton і nextTabButton
    //якщо звертаємося до action.ArrowLeft, то викликаємо метод prevTabButton
    //якщо звертаємося до action.ArrowRight, то викликаємо метод nextTabButton
    //якщо code = "ArrowLeft", то викликаємо метод prevTabButton || action[code] = action.ArrowLeft = this.prevTabButton
    //якщо code = "ArrowRight", то викликаємо метод nextTabButton || action[code] = action.ArrowRight = this.nextTabButton
    //якщо code не відповідає жодному з цих значень, то action буде undefined

    action?.();
    //якщо action не є undefined, то викликаємо метод action
    //якщо action є undefined, то нічого не робимо

    // this.updateUI();  --> приховано, бо додається proxy
  };

  //Оголошуємо метод bindEvents, який прив'язує події click і keydown до кнопок табів
  bindEvents() {
    this.buttonCollection.forEach((button, index) => {
      button.addEventListener("click", () => this.onButtonClick(index)); //при натисканні мишкою на кнопку табу
    });

    this.rootElement.addEventListener("keydown", this.onKeyDown); //при натисканні на клавішу клавіатури (ArrowLeft <-, ArrowRight ->)
  }
}

//Створюємо колекцію всіх табів
class TabsCollection {
  //Описуємо конструктор, який викликає метод init
  constructor() {
    this.init();
  }
  //Описуємо метод init, який шукає всі елементи з класом data-js-tabs і створює для кожного елемента екземпляр класу Tabs
  init() {
    const rootElementsCollection = document.querySelectorAll(rootSelector);
    rootElementsCollection.forEach(element => {
      new Tabs(element as HTMLElement);
    });
  }
}

export default TabsCollection;
