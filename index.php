<?php include_once('config.php'); include('class/paginator.class.php'); ?>
<!doctype html>
<html lang="en-US" xmlns:fb="https://www.facebook.com/2008/fbml" xmlns:addthis="https://www.addthis.com/help/api-spec"  prefix="og: http://ogp.me/ns#" class="no-js">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Омский Государственный Технический Университет | Планы мероприятий</title>
	
	<link rel="shortcut icon" href="./public/16.ico" type="image/x-icon">
	<link rel="icon" href="./public/16.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->
	<style> 
	body {font-family: 'Roboto', sans-serif;}
	.btn { text-align: left; display: flex; flex-direction: row;align-items: center;}
	.btn-label {position: relative;left: -12px;display: inline-block;padding: 6px 12px; height: 100%; color: #eee;border-radius: 3px;margin-right:-4px;}
	.btn-labeled {padding-top: 0;padding-bottom: 0;}
	.word.btn-outline {
		border: 1px solid #2b579a;
	}
	.word.btn-outline:hover {
		background: #2b579a;
		color: #eee;
	}
	.word .btn-label {background: #28508c;}
	.add .btn-label {background: #0173ee;}
	.add.btn-outline {
		border: 1px solid #007bff;
	}
	.add.btn-outline:hover {
		background: #007bff;
		color: #eee;
	}
	</style>
</head>

<body>
	
	<div class="bg-white">
		<div class="container">
			<header class="row d-flex align-items-center py-1">

            	<img src="./public/logo.jpg" width="100" style="margin-left:-2px;"/>
            	<p style="margin-top:12px;">Омский<br> Государственный<br> Технический Университет</p>
				<a href="./add.php" class="btn btn-labeled btn-outline add" style="margin-left:auto;margin-right: 15px;"><span class="btn-label"><i class="fas fa-plus fa-sm"></i></span> Добавить события</a>
			</header>
		</div> <!--/.container-->
	</div>
	
	<div class="container mt-2">
    	<hr>
		<div class="d-flex flex-row">
			<form method="get" action="<?php echo $_SERVER['PHP_SELF'];?>" class="form-inline mr-2">
				<select name="tb1" onchange="submit()" class="form-control">
					<option>Выберите период</option>
					<?php
						$Continentqry   =   $db->query('SELECT DISTINCT continentName FROM countries ORDER BY continentName ASC');
						while($crow = $Continentqry->fetch_assoc()) {
							echo "<option";
							if(isset($_REQUEST['tb1']) and $_REQUEST['tb1']==$crow['continentName']) echo ' selected="selected"';
							echo ">{$crow['continentName']}</option>\n";
						}
					?>
				</select>
			</form>
			<a href="./download.php?y=2019&d=report" class="btn btn-labeled btn-outline word mr-2"><span class="btn-label"><i class="fas fa-file-word"></i></span> Создать отчет</a>
			<a href="./download.php?y=2019&d=request" class="btn btn-labeled btn-outline word"><span class="btn-label"><i class="fas fa-file-word"></i></span> Создать заявку</a>
		</div>
		<hr>
		<?php
		if(isset($_REQUEST['tb1'])) {
			$condition		=	"";
			if(isset($_GET['tb1']) and $_GET['tb1']!="")
			{
				$condition		.=	" AND continentName='".$_GET['tb1']."'";
			}
			
			//Main query
			$pages = new Paginator;
			$pages->default_ipp = 15;
			$sql_forms = $db->query("SELECT * FROM countries WHERE 1 ".$condition."");
			$pages->items_total = $sql_forms->num_rows;
			$pages->mid_range = 9;
			$pages->paginate();	
			
			$result	=	$db->query("SELECT * FROM countries WHERE 1 ".$condition." ORDER BY countryName ASC ".$pages->limit."");
		}
		?>
		<div class="clearfix"></div>
		
		<div class="row marginTop">
			<div class="col-sm-12 paddingLeft pagerfwt">
				<?php if($pages->items_total > 0) { ?>
					<?php echo $pages->display_pages();?>
				<?php }?>
			</div>
			<div class="clearfix"></div>
		</div>

		<div class="clearfix"></div>
		
		<table class="table table-bordered table-striped">
			<thead>
				<tr>
					<th>Sr#</th>
					<th>Country Name</th>
					<th>ID</th>
					<th>Country Code</th>
					<th>Currency Code</th>
					<th>Capital</th>
				</tr>
			</thead>
			<tbody>
				<?php 
				if($pages->items_total>0){
					$n  =   1;
					while($val  =   $result->fetch_assoc()){ 
				?>
				<tr>
					<td><?php echo $n++; ?></td>
					<td><?php echo mb_strtoupper($val['countryName']); ?></td>
					<td><?php echo $val['id']; ?></td>
					<td><?php echo mb_strtoupper($val['countryCode']); ?></td>
					<td><?php echo mb_strtoupper($val['currencyCode']); ?></td>
					<td><?php echo mb_strtoupper($val['capital']); ?></td>
				</tr>
				<?php 
					}
				}else{?>
				<tr>
					<td colspan="6" align="center"><span class="text-muted">Мероприятий не найдено!</span></td>
				</tr>
				<?php } ?>
			</tbody>
		</table>
		
		<div class="row mt-3 mb-3">
			<div class="col-sm-12 paddingLeft pagerfwt">
				<?php if($pages->items_total > 0) { ?>
					<?php 
						if(is_numeric($pages->items_per_page) AND $pages->items_per_page < $pages->items_total) { echo "<a href='".$_SERVER['PHP_SELF']."?ipp=All".$pages->querystring."' class='text-muted'>Показать все ".$pages->items_total."</a>"; }
						else { echo "<span class='text-muted'>Всего мероприятий: ".$pages->items_total."</span>"; } 
					?>
				<?php }?>
			</div>  
    	</div> <!--/.container-->
	</div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
    
</body>
</html>