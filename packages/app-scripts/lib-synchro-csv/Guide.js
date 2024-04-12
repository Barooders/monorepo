function publishGuide(langue) {
  var guideSheet = SpreadsheetApp.getActive().getSheetByName("Guide");
  guideSheet.clearContents();
  var rangeToFormat = guideSheet.getRange(1, 2).clearFormat();

  var title = "Guide";
  var titleFirstPart = "Seul l'onglet Vendeur vous est dédié, il se départage en trois parties :"
  var firstPart = "- les colonnes grises dédiées à Barooders, inutile d'y toucher"
    + "\n- les colonnes vertes qui correspondent aux données manquantes et que vous devez donc compléter"
    + "\n- puis tout à droite, vos données brutes";
  var titleSecondPart = "Quelles sont les règles à suivre ?"
  var secondPart = "1. Ne pas changer l'ordre des colonnes (si vous souhaitez le faire pour vous simplifier la mise à jour du fichier par exemple, contactez-nous)"
    + "\n2. Ne pas supprimer de lignes, supprimez seulement le contenu de la ligne avec la touche Supprimer de votre clavier"
    + "\n3. Mettre à jour régulièrement les colonnes Actif/Inactif et Quantité"
    + "\n- la colonne Actif/Inactif vous permet de mettre en ligne un produit ou de le retirer"
    + "\n- la colonne Quantité permet d'indiquer la quantité disponible"
    + "\n4. Les URL d'image doivent afficher uniquement une photo, pas une page web d'un produit";
  var titleThirdPart = "Comment mettre à jour mes données ?"
  var thirdPart = "1 - Rendez-vous dans l'onglet Vendor"
    + "\n2 - Faites vos modifications"
    + "\nEffacer une ligne"
    + "\n- Sélectionnez la ligne en entier en cliquant sur son numéro à gauche, puis appuyez sur la touche Supprimer de votre clavier"
    + "\nModifier une ligne"
    + "\n- Modifiez une donnée en écrivant directement dans sa cellule"
    + "\nAjouter une ligne"
    + "\n- Ecrivez simplement dans une ligne vide"
    + "\n3 - Cliquez sur le menu UPDATE en haut de la page puis sur START pour lancer la mise à jour"
    + "\n4 - Une fois seulement que la notification UPDATE SUCCESSFUL apparaît, vous pouvez fermer le fichier";

  var listElement = [title,
                      titleFirstPart,
                      firstPart,
                      titleSecondPart,
                      secondPart,
                      titleThirdPart,
                      thirdPart];
  var guideContent = listElement.join("\n\n");

  // Set up the rich text value with HTML tags
  var richTextValueBuilder = SpreadsheetApp.newRichTextValue().setText(guideContent).build();
  rangeToFormat.setRichTextValue(richTextValueBuilder);
}
