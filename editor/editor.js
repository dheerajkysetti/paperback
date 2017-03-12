(function () {
    var editorPromise = tinymce.init({
        selector: '#tinymceEditor',
        plugins: '',
        toolbar: '',
        height: 400
    });
    var richEditor = null;
    var htmlTextArea = $('#htmlContent');
    var htmlEditor = CodeMirror.fromTextArea(htmlTextArea[0], {
        lineNumbers: true,
        matchTags: { bothTags: true },
        mode: "xml"
    });
    var blogDescription;
    var uiState = {};
    uiState.richEditor = true;
    uiState.htmlEditor = true;
    uiState.createBlog = {};

    $.getJSON("../blog_content/blog_description.json",
        function (data) {
            blogDescription = data;
        });


    $('#richEditorBtn').on('click', function () {
        uiState.richEditor = !uiState.richEditor;
        if (uiState.richEditor) {
            $(this).addClass('btn-primary').removeClass('btn-default');
            $('#richEditorCol')
                .addClass('show')
                .removeClass('hidden');
        } else {
            $(this).addClass('btn-default').removeClass('btn-primary');
            $('#richEditorCol')
                .addClass('hidden')
                .removeClass('show');
        }
        setCol();
    });
    $('#rawHtmlBtn').on('click', function () {
        uiState.htmlEditor = !uiState.htmlEditor;
        if (uiState.htmlEditor) {
            $(this).addClass('btn-primary').removeClass('btn-default');
            $('#htmlEditorCol').addClass('show').removeClass('hidden');
        } else {
            $(this).addClass('btn-default').removeClass('btn-primary');
            $('#htmlEditorCol').addClass('hidden').removeClass('show');
        }
        setCol();
    });

    var setCol = function () {
        if (uiState.htmlEditor && uiState.richEditor) {
            $('#htmlEditorCol').addClass('col-md-6');
            $('#richEditorCol').addClass('col-md-6');
        } else {
            if (uiState.htmlEditor) {
                $('#htmlEditorCol').removeClass('col-md-6').addClass('col-md-12');
            } else if (uiState.richEditor) {
                $('#richEditorCol').removeClass('col-md-6').addClass('col-md-12');
            } else {
                $('#richEditorCol').removeClass('col-md-6 col-md-12');
                $('#htmlEditorCol').removeClass('col-md-6 col-md-12');
            }
        }

    };


    var updateHtml = function () {
        if (!richEditor || !htmlEditor) {
            return;
        }
        htmlEditor.setValue(richEditor.getContent());
    };

    var updateRichEditor = function () {
        if (!richEditor || !htmlEditor) {
            return;
        }
        richEditor.setContent(htmlEditor.getValue());
    };

    $('#refreshBtn').on('click', function () {
        updateHtml();
        updateRichEditor();
    });

    editorPromise.then(function (e) {
        richEditor = e[0];
        richEditor.on('keyup', _.debounce(updateHtml, 300));
        richEditor.dom.loadCSS('../node_modules/bootstrap/dist/css/bootstrap.min.css');
        tinymce.ScriptLoader.load('../node_modules/bootstrap/dist/js/bootstrap.min.js');
        updateHtml();
    });

    htmlEditor.on('keyup', _.debounce(updateRichEditor, 300));




    //Create Blog Entry
    $('#openBlog').on('click', function () { });


    $('#createBlogModal').on('show.bs.modal', function (e) {
        $('#blogsList').empty();
        _.forEach(blogDescription.posts, function (val) {
            $('#blogList').append('<option value="' + val.title + '">' + "" + '</option>');
        });

        var urlInput = $('#inUrl');
        $('#inTitle').on('keyup', function () {
            urlInput.val(_.kebabCase(this.value));
        });


    });

    $('#openBlog').on('click', function () {
        var url = $('#inUrl').val();
        var ret = _.find(blogDescription, function (blog) {
            return blog.url === url;
        });
        if (ret === undefined) {
            createBlog();
        } else {
            $('#inDescription').val(ret.description);
            $('#inUrl').val(ret.url);
            $('#inTags').val(ret.tags);
        }

    });


    function createBlog() {
        var titleInput = $('#inTitle');
        var descriptionInput = $('#inDescription');
        var urlInput = $('#inUrl');
        var tagsInput = $('#inTags');

        uiState.createBlog = {
            title: titleInput.val(),
            description: descriptionInput.val(),
            url: urlInput.val(),
            tags: tagsInput.val()
        };
        $.post({
            dataType: "json",
            contentType: "application/json",
            url: "./createblog",
            data: JSON.stringify(uiState.createBlog)
        });
    }



})();