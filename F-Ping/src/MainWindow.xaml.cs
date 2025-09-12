
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Core;
using Microsoft.Win32; // Needed for Registry (Start with Windows)
using System;
using System.Diagnostics;
using System.IO;
using System.IO;
using System.Net.NetworkInformation; // Needed for Ping
using System.Runtime.InteropServices; // Needed for Host Object
using System.Text;
using System.Threading.Tasks;       // Needed for Task
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace FPing_V2
{
   
    [ClassInterface(ClassInterfaceType.AutoDual)]
    [ComVisible(true)]   
    public class HostController
    {
    
        [return: MarshalAs(UnmanagedType.FunctionPtr)]
        public async Task<long> PingServer(string address)
        {
            try
            {
                using (var pinger = new Ping())
                {
                    var reply = await pinger.SendPingAsync(address, 1000); // 1-second timeout
                    return reply.Status == IPStatus.Success ? reply.RoundtripTime : -1;
                }
            }
            catch
            {
                return -1; // Return -1 on failure
            }
        }

        public async Task<long> GetServerStatus(string address)
        {
            try
            {
                using (var pinger = new Ping())
                {
                    string data = "Hello World! This is a ping test.";

                    byte[] buffer = Encoding.ASCII.GetBytes(data);

                    int timeout = 1000; // 1 second

                    var reply = await pinger.SendPingAsync(address, timeout, buffer);

                    return reply.Status == IPStatus.Success ? reply.RoundtripTime : -1;
                }
            }
            catch
            {
                return -1; // Return -1 on failure
            }
        }


        public void SetStartup(bool startup)
        {
            try
            {
                string appName = "FPing-V2"; 
                RegistryKey rk = Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true);

                if (startup)
                {
                    // Use AppDomain.CurrentDomain.BaseDirectory for the path to your .exe
                    string exePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, appName + ".exe");
                    rk.SetValue(appName, $"\"{exePath}\"");
                }
                else
                {
                    rk.DeleteValue(appName, false);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Failed to update startup settings: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }



public partial class MainWindow : Window
    {

   
        private CoreWebView2 _webView2;
        string _Uri = "https://fpingbackend.vercel.app/";


        public MainWindow()
        {
            InitializeComponent();
            InitializeAsync();

            this.MouseDown += new MouseButtonEventHandler(Window_MouseDown);
            webView.CoreWebView2InitializationCompleted += OnCoreWebView2InitializationCompleted;
        }



        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            // Check if the left mouse button was clicked
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                // This built-in WPF method allows the window to be dragged
                this.DragMove();
            }
        }
        private async Task InitializeAsync()
        {



        var options = new CoreWebView2EnvironmentOptions("--allow-file-access-from-files");

            // Create the environment with the options
            var environment = await CoreWebView2Environment.CreateAsync(null, null, options);

            // Ensure CoreWebView2 with the created environment
            await webView.EnsureCoreWebView2Async(environment);  
        }

        private async void  OnCoreWebView2InitializationCompleted(object sender, CoreWebView2InitializationCompletedEventArgs e)
        {
            if (e.IsSuccess)
            {
                _webView2 = webView.CoreWebView2;


                webView.CoreWebView2.AddHostObjectToScript("controller", new HostController());

                // a few configs so the app feels more real

                webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
                webView.CoreWebView2.Settings.IsPinchZoomEnabled = false;
                webView.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled = false;
                webView.CoreWebView2.Settings.IsZoomControlEnabled = false;



                webView.Source = new Uri (_Uri);

            }
            else
            {
                MessageBox.Show("WebView2 initialization failed.");
            }
        }



        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void MinimizeButton_Click(object sender, RoutedEventArgs e)
        {

        }

    }
    }


