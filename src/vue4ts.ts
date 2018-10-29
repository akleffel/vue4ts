declare var Vue;

class VueClass
{
	// very base API of Vue.js
	// TODO: create from Vue source

	$parent: VueClass;
	$children: Array<any>;
	$el: HTMLElement;
	$root: VueClass;

	beforeCreate()
	{
	}

	created()
	{
	}

	beforeMount()
	{
	}

	mounted()
	{
	}

	beforeUpdate()
	{
	}

	updated()
	{
	}

	activated()
	{
	}

	deactivated()
	{
	}

	beforeDestroy()
	{
	}

	destroyed()
	{
	}

	$nextTick(fn: Function)
	{
	}
}

class VueComponent extends VueClass
{
	constructor(readonly name: string, readonly template: string)
	{
		super();
	}
}

class Vue4Ts
{
	private static _getOptions(instance: VueClass, el: string)
	{
		var proto = Object.getPrototypeOf(instance);

		var properties = Object.getOwnPropertyNames(proto);

		var methodKeys = new Array<string>();
		var computedKeys = new Array<string>();

		const sysMembers = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'activated', 'deactivated', 'beforeDestroy', 'destroyed'];

		var definedSysKeys = new Array<string>();

		for (var i = 0; i < properties.length; i++)
		{
			var key = properties[i];

			console.log(key);

			if (key == 'constructor')
				continue;

			if (sysMembers.indexOf(key) != -1)
			{
				definedSysKeys.push(key);
				continue;
			}

			const prop = Object.getOwnPropertyDescriptor(proto, key);

			if (prop.get && prop.set === undefined)
			{
				computedKeys.push(key);
				continue;
			}

			methodKeys.push(key);
		}

		var dataKeys = new Array<string>();

		for (var key in instance)
		{
			if (instance.hasOwnProperty(key))
			{
				dataKeys.push(key);
			}
		}

		var options = {
			el: el,
			data: {},
			methods: {},
			computed: {},
		};

		for (var i = 0; i < methodKeys.length; i++)
		{
			var key = methodKeys[i];
			options.methods[key] = proto[key];
		}

		for (var i = 0; i < computedKeys.length; i++)
		{
			var key = computedKeys[i];
			options.computed[key] = Object.getOwnPropertyDescriptor(proto, key).get;
		}

		for (var i = 0; i < dataKeys.length; i++)
		{
			var key = dataKeys[i];
			options.data[key] = instance[key];
		}

		for (var i = 0; i < definedSysKeys.length; i++)
		{
			var key = definedSysKeys[i];
			options[key] = instance[key];
		}

		return options;
	}

	static vue(instance: VueClass, el: string) : any
	{
		return new Vue(this._getOptions(instance, el));
	}

	static component(instance: VueComponent)
	{
		var opts = this._getOptions(instance, null);

		const sysDataKeys = ['template', 'name'];

		var props = Object.getOwnPropertyNames(opts.data);
		var componentProps = new Array<string>();

		for (var i = 0; i < props.length; i++)
		{
			if (sysDataKeys.indexOf(props[i]) == -1)
				componentProps.push(props[i]);
		}

		return Vue.component(instance.name,
			{
				props: componentProps,
				template: instance.template,
				methods: opts.methods,
				computed: opts.computed
			});
	}
}