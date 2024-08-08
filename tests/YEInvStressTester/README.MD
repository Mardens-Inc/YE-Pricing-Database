# StressTester: A Quick Overview

Our `StressTester` program is a handy tool created in C# for testing the speed and reliability of your servers. It is contained within the `YEInvStressTester` namespace.

## What Does It Do?

In a nutshell, `StressTester` bombards a specific server with multiple HTTP requests. It aims to measure how the server handles high volumes of data changes. This allows you to check the performance and potentially identify weak points in the server's responsiveness.

## How Does It Work?

The core of the program lies in its `Run` method. This method sends bundles of requests to the server and times how long the server takes to respond to each type of request. The results are then displayed for further analysis.

Several types of HTTP methods are utilized during these tests:

- `GET`: Asks the server for specific information.
- `POST`: Sends new information to the server.
- `DELETE`: Removes specified data from the server.

## How Do I Use It?

To get the program running, all you need to do is start the `StressTester` and let it run its course. The times taken by different server operations are printed out at the end of the tests.

It's important to note that this is not a fully detailed performance debugger. Rather, it's a quick and easy way to load test your server and identify areas where performance might be lagging. This gives you a good starting point for further in-depth analysis when you need to fine-tune the server's performance.

