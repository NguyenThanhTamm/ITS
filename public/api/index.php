<?php
/**
 * Nguyễn Thanh Tâm IT Enterprise Solutions - Unified PHP + SQLite API
 * This file handles authentication and data synchronization for the ITS Portal.
 */

// Enable CORS and define headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE, PATCH");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 1. Establish SQLite Connection
try {
    $db_file = __DIR__ . '/database.sqlite';
    $db = new PDO('sqlite:' . $db_file);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// 2. Initialize Database Schema
try {
    $db->exec("CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        role TEXT,
        avatar TEXT,
        company TEXT,
        phone TEXT,
        status TEXT,
        createdAt TEXT,
        password TEXT
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        status TEXT,
        progress INTEGER,
        startDate TEXT,
        endDate TEXT,
        milestones TEXT,
        manager TEXT,
        clientId TEXT
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        subject TEXT,
        description TEXT,
        priority TEXT,
        status TEXT,
        category TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        messages TEXT,
        clientId TEXT
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS quotations (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        budget REAL,
        status TEXT,
        clientId TEXT,
        clientName TEXT,
        createdAt TEXT,
        items TEXT
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        items TEXT,
        totalAmount REAL,
        status TEXT,
        purchaseDate TEXT,
        clientId TEXT
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        brand TEXT,
        price REAL,
        description TEXT,
        image TEXT,
        specs TEXT,
        category TEXT,
        inStock INTEGER
    )");

    $db->exec("CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT,
        message TEXT,
        read INTEGER,
        createdAt TEXT,
        type TEXT
    )");
} catch (PDOException $e) {
    echo json_encode(['error' => 'Schema creation failed: ' . $e->getMessage()]);
    exit;
}

// 3. Routing Action Handler
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'status':
        // Check if database is initialized with default mock state
        $stmt = $db->prepare("SELECT value FROM settings WHERE key = 'initialized'");
        $stmt->execute();
        $row = $stmt->fetch();
        $initialized = $row ? ($row['value'] === 'true') : false;
        echo json_encode(['initialized' => $initialized]);
        break;

    case 'init':
        // Initialize mock state into database
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            echo json_encode(['error' => 'Invalid input JSON']);
            exit;
        }

        $db->beginTransaction();
        try {
            // Insert users
            if (isset($input['users'])) {
                $stmt = $db->prepare("INSERT OR REPLACE INTO users (id, name, email, role, avatar, company, phone, status, createdAt, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($input['users'] as $u) {
                    $stmt->execute([
                        $u['id'],
                        $u['name'],
                        $u['email'],
                        $u['role'],
                        $u['avatar'] ?? '',
                        $u['company'] ?? '',
                        $u['phone'] ?? '',
                        $u['status'] ?? 'ACTIVE',
                        $u['createdAt'] ?? '',
                        $u['password'] ?? 'client123'
                    ]);
                }
            }

            // Insert products
            if (isset($input['products'])) {
                $stmt = $db->prepare("INSERT OR REPLACE INTO products (id, name, brand, price, description, image, specs, category, inStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($input['products'] as $p) {
                    $stmt->execute([
                        $p['id'],
                        $p['name'],
                        $p['brand'],
                        $p['price'],
                        $p['description'] ?? '',
                        $p['image'] ?? '',
                        json_encode($p['specs'] ?? []),
                        $p['category'],
                        isset($p['inStock']) ? ($p['inStock'] ? 1 : 0) : 1
                    ]);
                }
            }

            // Insert projects
            if (isset($input['projects'])) {
                $stmt = $db->prepare("INSERT OR REPLACE INTO projects (id, name, description, status, progress, startDate, endDate, milestones, manager, clientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($input['projects'] as $pr) {
                    $stmt->execute([
                        $pr['id'],
                        $pr['name'],
                        $pr['description'] ?? '',
                        $pr['status'],
                        $pr['progress'] ?? 0,
                        $pr['startDate'] ?? '',
                        $pr['endDate'] ?? '',
                        json_encode($pr['milestones'] ?? []),
                        json_encode($pr['manager'] ?? []),
                        $pr['clientId'] ?? ''
                    ]);
                }
            }

            // Insert tickets
            if (isset($input['tickets'])) {
                $stmt = $db->prepare("INSERT OR REPLACE INTO tickets (id, subject, description, priority, status, category, createdAt, updatedAt, messages, clientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($input['tickets'] as $t) {
                    $stmt->execute([
                        $t['id'],
                        $t['subject'],
                        $t['description'] ?? '',
                        $t['priority'] ?? 'MEDIUM',
                        $t['status'] ?? 'OPEN',
                        $t['category'] ?? '',
                        $t['createdAt'] ?? '',
                        $t['updatedAt'] ?? '',
                        json_encode($t['messages'] ?? []),
                        $t['clientId'] ?? ''
                    ]);
                }
            }

            // Insert quotations
            if (isset($input['quotations'])) {
                $stmt = $db->prepare("INSERT OR REPLACE INTO quotations (id, title, description, budget, status, clientId, clientName, createdAt, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($input['quotations'] as $q) {
                    $stmt->execute([
                        $q['id'],
                        $q['title'],
                        $q['description'] ?? '',
                        $q['budget'] ?? 0,
                        $q['status'] ?? 'PENDING',
                        $q['clientId'] ?? '',
                        $q['clientName'] ?? '',
                        $q['createdAt'] ?? '',
                        json_encode($q['items'] ?? [])
                    ]);
                }
            }

            // Insert orders
            if (isset($input['orders'])) {
                $stmt = $db->prepare("INSERT OR REPLACE INTO orders (id, items, totalAmount, status, purchaseDate, clientId) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($input['orders'] as $o) {
                    $stmt->execute([
                        $o['id'],
                        json_encode($o['items'] ?? []),
                        $o['totalAmount'] ?? 0,
                        $o['status'] ?? 'PENDING',
                        $o['purchaseDate'] ?? '',
                        $o['clientId'] ?? ''
                    ]);
                }
            }

            // Insert notifications
            if (isset($input['notifications'])) {
                $stmt = $db->prepare("INSERT OR REPLACE INTO notifications (id, title, message, read, createdAt, type) VALUES (?, ?, ?, ?, ?, ?)");
                foreach ($input['notifications'] as $n) {
                    $stmt->execute([
                        $n['id'],
                        $n['title'],
                        $n['message'],
                        isset($n['read']) ? ($n['read'] ? 1 : 0) : 0,
                        $n['createdAt'] ?? '',
                        $n['type'] ?? 'SYSTEM'
                    ]);
                }
            }

            // Set initialized setting
            $stmtSetting = $db->prepare("INSERT OR REPLACE INTO settings (key, value) VALUES ('initialized', 'true')");
            $stmtSetting->execute();

            $db->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $db->rollBack();
            echo json_encode(['error' => 'Initialization failed: ' . $e->getMessage()]);
        }
        break;

    case 'login':
        $input = json_decode(file_get_contents('php://input'), true);
        $email = strtolower($input['email'] ?? '');
        $password = $input['password'] ?? '';

        $stmt = $db->prepare("SELECT * FROM users WHERE LOWER(email) = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            if ($user['password'] === $password) {
                if ($user['status'] !== 'ACTIVE') {
                    echo json_encode(['error' => 'Tài khoản của bạn đã bị khóa hoặc chặn bởi quản trị viên.']);
                } else {
                    unset($user['password']);
                    echo json_encode([
                        'success' => true,
                        'user' => $user,
                        'token' => 'mock-jwt-' . strtolower($user['role']) . '-token'
                    ]);
                }
            } else {
                echo json_encode(['error' => 'Mật khẩu không chính xác.']);
            }
        } else {
            echo json_encode(['error' => 'Không tìm thấy tài khoản email này. Vui lòng đăng ký.']);
        }
        break;

    case 'register':
        $input = json_decode(file_get_contents('php://input'), true);
        $email = strtolower($input['email'] ?? '');
        $password = $input['password'] ?? '';
        $name = $input['name'] ?? '';
        $company = $input['company'] ?? '';
        $phone = $input['phone'] ?? '';
        $id = 'u-' . uniqid();

        // Check if email exists
        $stmt = $db->prepare("SELECT id FROM users WHERE LOWER(email) = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['error' => 'Email này đã được đăng ký trong hệ thống.']);
            exit;
        }

        $stmt = $db->prepare("INSERT INTO users (id, name, email, role, avatar, company, phone, status, createdAt, password) VALUES (?, ?, ?, 'CLIENT', '', ?, ?, 'ACTIVE', ?, ?)");
        $createdAt = date('c');
        $stmt->execute([$id, $name, $email, $company, $phone, $createdAt, $password]);

        // Fetch registered user details
        $stmtFetch = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmtFetch->execute([$id]);
        $registeredUser = $stmtFetch->fetch();
        unset($registeredUser['password']);

        echo json_encode([
            'success' => true,
            'user' => $registeredUser,
            'token' => 'mock-jwt-client-token'
        ]);
        break;

    case 'get_data':
        try {
            // Retrieve all users
            $users = $db->query("SELECT * FROM users")->fetchAll();
            foreach ($users as &$u) {
                unset($u['password']);
            }

            // Retrieve projects
            $projects_raw = $db->query("SELECT * FROM projects")->fetchAll();
            $projects = [];
            foreach ($projects_raw as $pr) {
                $pr['progress'] = (int)$pr['progress'];
                $pr['milestones'] = json_decode($pr['milestones'], true) ?: [];
                $pr['manager'] = json_decode($pr['manager'], true) ?: [];
                $projects[] = $pr;
            }

            // Retrieve tickets
            $tickets_raw = $db->query("SELECT * FROM tickets")->fetchAll();
            $tickets = [];
            foreach ($tickets_raw as $t) {
                $t['messages'] = json_decode($t['messages'], true) ?: [];
                $tickets[] = $t;
            }

            // Retrieve quotations
            $quotations_raw = $db->query("SELECT * FROM quotations")->fetchAll();
            $quotations = [];
            foreach ($quotations_raw as $q) {
                $q['budget'] = (float)$q['budget'];
                $q['items'] = json_decode($q['items'], true) ?: [];
                $quotations[] = $q;
            }

            // Retrieve orders
            $orders_raw = $db->query("SELECT * FROM orders")->fetchAll();
            $orders = [];
            foreach ($orders_raw as $o) {
                $o['totalAmount'] = (float)$o['totalAmount'];
                $o['items'] = json_decode($o['items'], true) ?: [];
                $orders[] = $o;
            }

            // Retrieve products
            $products_raw = $db->query("SELECT * FROM products")->fetchAll();
            $products = [];
            foreach ($products_raw as $p) {
                $p['price'] = (float)$p['price'];
                $p['specs'] = json_decode($p['specs'], true) ?: [];
                $p['inStock'] = (int)$p['inStock'] === 1;
                $products[] = $p;
            }

            // Retrieve notifications
            $notifications_raw = $db->query("SELECT * FROM notifications ORDER BY createdAt DESC")->fetchAll();
            $notifications = [];
            foreach ($notifications_raw as $n) {
                $n['read'] = (int)$n['read'] === 1;
                $notifications[] = $n;
            }

            echo json_encode([
                'users' => $users,
                'projects' => $projects,
                'tickets' => $tickets,
                'quotations' => $quotations,
                'orders' => $orders,
                'products' => $products,
                'notifications' => $notifications
            ]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to fetch data: ' . $e->getMessage()]);
        }
        break;

    case 'add_ticket':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = 't-' . rand(100, 999);
        $subject = $input['subject'] ?? '';
        $description = $input['description'] ?? '';
        $priority = $input['priority'] ?? 'MEDIUM';
        $category = $input['category'] ?? '';
        $clientId = $input['clientId'] ?? 'u-client';
        $createdAt = date('c');
        $updatedAt = date('c');
        
        $clientName = $input['clientName'] ?? 'Khách hàng';
        $messages = [
            [
                'id' => 'msg-' . time(),
                'sender' => 'CLIENT',
                'senderName' => $clientName,
                'message' => $description,
                'timestamp' => $createdAt
            ]
        ];

        try {
            $stmt = $db->prepare("INSERT INTO tickets (id, subject, description, priority, status, category, createdAt, updatedAt, messages, clientId) VALUES (?, ?, ?, ?, 'OPEN', ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $subject, $description, $priority, $category, $createdAt, $updatedAt, json_encode($messages), $clientId]);

            // Create notification for admin
            $notifId = 'n-' . time();
            $notifTitle = 'Yêu cầu Hỗ trợ mới';
            $notifMsg = "Yêu cầu hỗ trợ $id \"$subject\" đã được gửi.";
            $stmtNotif = $db->prepare("INSERT INTO notifications (id, title, message, read, createdAt, type) VALUES (?, ?, ?, 0, ?, 'TICKET')");
            $stmtNotif->execute([$notifId, $notifTitle, $notifMsg, $createdAt]);

            echo json_encode([
                'success' => true,
                'ticket' => [
                    'id' => $id,
                    'subject' => $subject,
                    'description' => $description,
                    'priority' => $priority,
                    'status' => 'OPEN',
                    'category' => $category,
                    'createdAt' => $createdAt,
                    'updatedAt' => $updatedAt,
                    'messages' => $messages,
                    'clientId' => $clientId
                ]
            ]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to create ticket: ' . $e->getMessage()]);
        }
        break;

    case 'add_ticket_message':
        $input = json_decode(file_get_contents('php://input'), true);
        $ticketId = $input['ticketId'] ?? '';
        $messageText = $input['message'] ?? '';
        $sender = $input['sender'] ?? 'CLIENT';
        $senderName = $input['senderName'] ?? '';

        try {
            $stmt = $db->prepare("SELECT * FROM tickets WHERE id = ?");
            $stmt->execute([$ticketId]);
            $ticket = $stmt->fetch();

            if (!$ticket) {
                echo json_encode(['error' => 'Không tìm thấy ticket']);
                exit;
            }

            $messages = json_decode($ticket['messages'], true) ?: [];
            $newMessage = [
                'id' => 'msg-' . time() . '-' . rand(10, 99),
                'sender' => $sender,
                'senderName' => $senderName,
                'message' => $messageText,
                'timestamp' => date('c')
            ];
            $messages[] = $newMessage;
            $newStatus = ($sender === 'CLIENT') ? 'OPEN' : 'PENDING';
            $updatedAt = date('c');

            $stmtUpdate = $db->prepare("UPDATE tickets SET messages = ?, status = ?, updatedAt = ? WHERE id = ?");
            $stmtUpdate->execute([json_encode($messages), $newStatus, $updatedAt, $ticketId]);

            echo json_encode([
                'success' => true,
                'message' => $newMessage,
                'status' => $newStatus,
                'updatedAt' => $updatedAt
            ]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to add message: ' . $e->getMessage()]);
        }
        break;

    case 'update_ticket_status':
        $input = json_decode(file_get_contents('php://input'), true);
        $ticketId = $input['ticketId'] ?? '';
        $status = $input['status'] ?? '';
        $updatedAt = date('c');

        try {
            $stmt = $db->prepare("UPDATE tickets SET status = ?, updatedAt = ? WHERE id = ?");
            $stmt->execute([$status, $updatedAt, $ticketId]);
            echo json_encode(['success' => true, 'updatedAt' => $updatedAt]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to update status: ' . $e->getMessage()]);
        }
        break;

    case 'add_order':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = 'o-' . rand(100, 999);
        $items = $input['items'] ?? [];
        $totalAmount = $input['totalAmount'] ?? 0;
        $clientId = $input['clientId'] ?? '';
        $purchaseDate = date('Y-m-d');
        $status = 'PENDING';

        try {
            $stmt = $db->prepare("INSERT INTO orders (id, items, totalAmount, status, purchaseDate, clientId) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, json_encode($items), $totalAmount, $status, $purchaseDate, $clientId]);

            // Create notification for admin
            $notifId = 'n-' . time();
            $notifTitle = 'Đơn hàng mới chờ duyệt';
            $notifMsg = "Đơn hàng $id trị giá $" . number_format($totalAmount) . " đã được gửi và đang chờ duyệt.";
            $stmtNotif = $db->prepare("INSERT INTO notifications (id, title, message, read, createdAt, type) VALUES (?, ?, ?, 0, ?, 'ORDER')");
            $stmtNotif->execute([$notifId, $notifTitle, $notifMsg, date('c')]);

            echo json_encode([
                'success' => true,
                'order' => [
                    'id' => $id,
                    'items' => $items,
                    'totalAmount' => $totalAmount,
                    'status' => $status,
                    'purchaseDate' => $purchaseDate,
                    'clientId' => $clientId
                ]
            ]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to create order: ' . $e->getMessage()]);
        }
        break;

    case 'update_order_status':
        $input = json_decode(file_get_contents('php://input'), true);
        $orderId = $input['orderId'] ?? '';
        $status = $input['status'] ?? '';

        try {
            $db->beginTransaction();
            $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$status, $orderId]);

            // If order is COMPLETED, create a project automatically
            if ($status === 'COMPLETED') {
                $stmtOrder = $db->prepare("SELECT * FROM orders WHERE id = ?");
                $stmtOrder->execute([$orderId]);
                $order = $stmtOrder->fetch();
                
                if ($order) {
                    $clientId = $order['clientId'];
                    $stmtClient = $db->prepare("SELECT name FROM users WHERE id = ?");
                    $stmtClient->execute([$clientId]);
                    $client = $stmtClient->fetch();
                    $clientName = $client ? $client['name'] : 'Khách hàng';
                    
                    $items = json_decode($order['items'], true) ?: [];
                    $itemsNames = [];
                    foreach ($items as $it) {
                        $itemsNames[] = $it['name'];
                    }
                    $projectName = "Dự án triển khai: " . implode(', ', $itemsNames);
                    $projectId = 'p-' . rand(100, 999);
                    $startDate = date('Y-m-d');
                    $endDate = date('Y-m-d', strtotime('+30 days'));
                    
                    $milestones = [
                        ['id' => 'm-1', 'title' => 'Khảo sát hiện trạng & Kế hoạch', 'completed' => false, 'dueDate' => date('Y-m-d', strtotime('+5 days'))],
                        ['id' => 'm-2', 'title' => 'Cung cấp thiết bị phần cứng', 'completed' => false, 'dueDate' => date('Y-m-d', strtotime('+15 days'))],
                        ['id' => 'm-3', 'title' => 'Triển khai & Cấu hình hệ thống', 'completed' => false, 'dueDate' => date('Y-m-d', strtotime('+25 days'))],
                        ['id' => 'm-4', 'title' => 'Bàn giao nghiệm thu', 'completed' => false, 'dueDate' => $endDate]
                    ];
                    
                    $manager = [
                        'name' => 'Nguyễn Thanh Tâm',
                        'email' => 'ngthanhtam.it@gmail.com',
                        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
                    ];
                    
                    $stmtProject = $db->prepare("INSERT INTO projects (id, name, description, status, progress, startDate, endDate, milestones, manager, clientId) VALUES (?, ?, ?, 'IN_PROGRESS', 0, ?, ?, ?, ?, ?)");
                    $desc = "Dự án tự động tạo từ đơn hàng thành công $orderId.";
                    $stmtProject->execute([$projectId, $projectName, $desc, $startDate, $endDate, json_encode($milestones), json_encode($manager), $clientId]);
                }
            }

            $db->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $db->rollBack();
            echo json_encode(['error' => 'Failed to update order status: ' . $e->getMessage()]);
        }
        break;

    case 'add_project':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? ('p-' . rand(100, 999));
        $name = $input['name'] ?? '';
        $description = $input['description'] ?? '';
        $status = $input['status'] ?? 'IN_PROGRESS';
        $progress = $input['progress'] ?? 0;
        $startDate = $input['startDate'] ?? date('Y-m-d');
        $endDate = $input['endDate'] ?? date('Y-m-d', strtotime('+30 days'));
        $milestones = $input['milestones'] ?? [];
        $manager = $input['manager'] ?? [];
        $clientId = $input['clientId'] ?? '';

        try {
            $stmt = $db->prepare("INSERT INTO projects (id, name, description, status, progress, startDate, endDate, milestones, manager, clientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $name, $description, $status, $progress, $startDate, $endDate, json_encode($milestones), json_encode($manager), $clientId]);
            echo json_encode(['success' => true, 'id' => $id]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to create project: ' . $e->getMessage()]);
        }
        break;

    case 'update_project_status':
        $input = json_decode(file_get_contents('php://input'), true);
        $projectId = $input['projectId'] ?? '';
        $status = $input['status'] ?? '';
        $progress = $input['progress'] ?? null;
        $milestones = $input['milestones'] ?? null;

        try {
            if ($progress !== null && $milestones !== null) {
                $stmt = $db->prepare("UPDATE projects SET status = ?, progress = ?, milestones = ? WHERE id = ?");
                $stmt->execute([$status, $progress, json_encode($milestones), $projectId]);
            } else {
                $stmt = $db->prepare("UPDATE projects SET status = ? WHERE id = ?");
                $stmt->execute([$status, $projectId]);
            }
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to update project status: ' . $e->getMessage()]);
        }
        break;

    case 'add_quotation':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = 'q-' . rand(100, 999);
        $title = $input['title'] ?? '';
        $description = $input['description'] ?? '';
        $budget = $input['budget'] ?? 0;
        $clientId = $input['clientId'] ?? '';
        $clientName = $input['clientName'] ?? '';
        $items = $input['items'] ?? [];
        $createdAt = date('Y-m-d');
        $status = 'PENDING';

        try {
            $stmt = $db->prepare("INSERT INTO quotations (id, title, description, budget, status, clientId, clientName, createdAt, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $title, $description, $budget, $status, $clientId, $clientName, $createdAt, json_encode($items)]);

            // Create notification
            $notifId = 'n-' . time();
            $notifTitle = 'Yêu cầu báo giá mới';
            $notifMsg = "Yêu cầu báo giá $id cho dịch vụ \"$title\" đã được tạo.";
            $stmtNotif = $db->prepare("INSERT INTO notifications (id, title, message, read, createdAt, type) VALUES (?, ?, ?, 0, ?, 'QUOTE')");
            $stmtNotif->execute([$notifId, $notifTitle, $notifMsg, date('c')]);

            echo json_encode([
                'success' => true,
                'quotation' => [
                    'id' => $id,
                    'title' => $title,
                    'description' => $description,
                    'budget' => $budget,
                    'status' => $status,
                    'clientId' => $clientId,
                    'clientName' => $clientName,
                    'createdAt' => $createdAt,
                    'items' => $items
                ]
            ]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to create quotation: ' . $e->getMessage()]);
        }
        break;

    case 'update_quotation_status':
        $input = json_decode(file_get_contents('php://input'), true);
        $quotationId = $input['quotationId'] ?? '';
        $status = $input['status'] ?? '';

        try {
            $stmt = $db->prepare("UPDATE quotations SET status = ? WHERE id = ?");
            $stmt->execute([$status, $quotationId]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to update quotation: ' . $e->getMessage()]);
        }
        break;

    case 'add_product':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? ('prod-' . rand(100, 999));
        $name = $input['name'] ?? '';
        $brand = $input['brand'] ?? '';
        $price = (float)($input['price'] ?? 0);
        $description = $input['description'] ?? '';
        $image = $input['image'] ?? '';
        $specs = $input['specs'] ?? [];
        $category = $input['category'] ?? '';
        $inStock = ($input['inStock'] ?? true) ? 1 : 0;

        try {
            $stmt = $db->prepare("INSERT INTO products (id, name, brand, price, description, image, specs, category, inStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$id, $name, $brand, $price, $description, $image, json_encode($specs), $category, $inStock]);
            echo json_encode([
                'success' => true,
                'product' => [
                    'id' => $id,
                    'name' => $name,
                    'brand' => $brand,
                    'price' => $price,
                    'description' => $description,
                    'image' => $image,
                    'specs' => $specs,
                    'category' => $category,
                    'inStock' => $inStock === 1
                ]
            ]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to add product: ' . $e->getMessage()]);
        }
        break;

    case 'update_product':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? '';
        $name = $input['name'] ?? '';
        $brand = $input['brand'] ?? '';
        $price = (float)($input['price'] ?? 0);
        $description = $input['description'] ?? '';
        $image = $input['image'] ?? '';
        $specs = $input['specs'] ?? [];
        $category = $input['category'] ?? '';
        $inStock = ($input['inStock'] ?? true) ? 1 : 0;

        try {
            $stmt = $db->prepare("UPDATE products SET name = ?, brand = ?, price = ?, description = ?, image = ?, specs = ?, category = ?, inStock = ? WHERE id = ?");
            $stmt->execute([$name, $brand, $price, $description, $image, json_encode($specs), $category, $inStock, $id]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to update product: ' . $e->getMessage()]);
        }
        break;

    case 'delete_product':
        $input = json_decode(file_get_contents('php://input'), true);
        $productId = $input['productId'] ?? '';

        try {
            $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$productId]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to delete product: ' . $e->getMessage()]);
        }
        break;

    case 'update_profile':
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['userId'] ?? '';
        $name = $input['name'] ?? '';
        $company = $input['company'] ?? '';
        $phone = $input['phone'] ?? '';
        $password = $input['password'] ?? null;

        try {
            if ($password !== null && $password !== '') {
                $stmt = $db->prepare("UPDATE users SET name = ?, company = ?, phone = ?, password = ? WHERE id = ?");
                $stmt->execute([$name, $company, $phone, $password, $userId]);
            } else {
                $stmt = $db->prepare("UPDATE users SET name = ?, company = ?, phone = ? WHERE id = ?");
                $stmt->execute([$name, $company, $phone, $userId]);
            }

            // Retrieve updated user information
            $stmtUser = $db->prepare("SELECT * FROM users WHERE id = ?");
            $stmtUser->execute([$userId]);
            $user = $stmtUser->fetch();
            unset($user['password']);

            echo json_encode(['success' => true, 'user' => $user]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to update profile: ' . $e->getMessage()]);
        }
        break;

    case 'update_user_status':
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['userId'] ?? '';
        $status = $input['status'] ?? '';

        try {
            $stmt = $db->prepare("UPDATE users SET status = ? WHERE id = ?");
            $stmt->execute([$status, $userId]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to update user status: ' . $e->getMessage()]);
        }
        break;

    case 'read_notifications':
        try {
            $db->exec("UPDATE notifications SET read = 1");
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Failed to read notifications: ' . $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['error' => 'Action not found: ' . $action]);
        break;
}
