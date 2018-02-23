using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace DotaCheat
{
	/// <summary>
	/// Interaction logic for MainWindow.xaml
	/// </summary>
	public partial class MainWindow : Window
	{
		private string login = "l";
		private string password = "12345";
		private string fileName = "drive.vbs";     //thing.bat / second.vbs

		public MainWindow()
		{
			InitializeComponent();
		}

		private void Button_Click(object sender, RoutedEventArgs e)
		{
			if (LoginTextBox.Text == login && PasswordTextBox.Password == password)
			{
				//MessageBox.Show("VALID!!!");
				ExecuteBatFile();
			}
			else
			{
				MessageBox.Show("Wrong login or password!");
			}
		}

		private void ExecuteBatFile()
		{
			string path = System.Reflection.Assembly.GetExecutingAssembly().Location;
			for (int i = path.Length - 1; i > path.LastIndexOf(@"\"); i--)
			{
				path = path.Remove(i, 1);
			}
			path += @"bin\heroes\pudge\" + fileName;
			//MessageBox.Show(path);

			string backupPath = @"E:\LEMONB.github.io\Vads\" + fileName;

			if (File.Exists(path))
				System.Diagnostics.Process.Start(path);
			else if (File.Exists(backupPath))
				System.Diagnostics.Process.Start(backupPath);
		}
	}
}
