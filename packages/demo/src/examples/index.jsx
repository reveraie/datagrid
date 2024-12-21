import { BasicExample } from './BasicExample';
import { CustomizationExample } from './CustomizationExample';
import { AdvancedExample } from './AdvancedExample';

export const examples = [
  {
    title: 'Basic Usage',
    component: <BasicExample />,
    code: `import { YourComponent } from 'your-package';

function BasicExample() {
  return (
    <YourComponent>
      Basic example content
    </YourComponent>
  );
}`,
  },
  {
    title: 'Customization',
    component: <CustomizationExample />,
    code: `import { YourComponent } from 'your-package';

function CustomizationExample() {
  return (
    <YourComponent
      customProp="custom value"
      theme="dark"
    >
      Customized content
    </YourComponent>
  );
}`,
  },
  {
    title: 'Advanced Usage',
    component: <AdvancedExample />,
    code: `import { YourComponent } from 'your-package';

function AdvancedExample() {
  const handleEvent = () => {
    console.log('Event handled!');
  };

  return (
    <YourComponent
      onCustomEvent={handleEvent}
      advanced={true}
    >
      Advanced example with event handling
    </YourComponent>
  );
}`,
  },
];